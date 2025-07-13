import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

function getProductFromHost(req) {
  const host = req.headers.host || '';
  const match = host.match(/^([a-z0-9-]+)\./i);
  return match ? match[1] : 'dashboard';
}

// Generate 6-digit code for 2FA
function generate2FACode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Store 2FA code in Redis or database (using Supabase for now)
async function store2FACode(email, code, product) {
  try {
    const { error } = await supabase
      .from('two_factor_codes')
      .upsert({
        email,
        code,
        product,
        expires_at: new Date(Date.now() + 10 * 60 * 1000).toISOString(), // 10 minutes
        created_at: new Date().toISOString()
      });
    return !error;
  } catch (error) {
    console.error('Error storing 2FA code:', error);
    return false;
  }
}

// Verify 2FA code
async function verify2FACode(email, code, product) {
  try {
    const { data, error } = await supabase
      .from('two_factor_codes')
      .select('*')
      .eq('email', email)
      .eq('code', code)
      .eq('product', product)
      .gte('expires_at', new Date().toISOString())
      .single();

    if (error || !data) {
      return false;
    }

    // Delete used code
    await supabase
      .from('two_factor_codes')
      .delete()
      .eq('email', email)
      .eq('code', code);

    return true;
  } catch (error) {
    console.error('Error verifying 2FA code:', error);
    return false;
  }
}

// Send 2FA code via email (using Supabase Auth for now)
async function send2FACode(email, code, product) {
  try {
    // For now, we'll use Supabase's built-in email functionality
    // In production, you'd integrate with SendGrid, AWS SES, etc.
    console.log(`2FA code ${code} sent to ${email} for product ${product}`);
    
    // You can implement actual email sending here
    // Example with SendGrid:
    // const sgMail = require('@sendgrid/mail');
    // sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    // await sgMail.send({
    //   to: email,
    //   from: 'noreply@yourdomain.com',
    //   subject: `Your ${product} verification code`,
    //   text: `Your verification code is: ${code}`,
    //   html: `<p>Your verification code is: <strong>${code}</strong></p>`
    // });
    
    return true;
  } catch (error) {
    console.error('Error sending 2FA code:', error);
    return false;
  }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { action, email, password, name, provider, code, method = 'email' } = req.body;
  const product = getProductFromHost(req);

  try {
    if (action === 'signup') {
      // Email/password signup
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { name: name || 'User', product }
        }
      });
      if (error) return res.status(400).json({ error: error.message });
      return res.status(201).json({ success: true, user: data.user });
    }

    if (action === 'login') {
      // Email/password login
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) return res.status(401).json({ error: error.message });
      
      // Check if 2FA is enabled for this user
      const { data: userData } = await supabase
        .from('users')
        .select('two_factor_enabled')
        .eq('email', email)
        .eq('product', product)
        .single();

      if (userData?.two_factor_enabled) {
        return res.status(200).json({ 
          success: true, 
          requires2FA: true, 
          message: '2FA required' 
        });
      }

      return res.status(200).json({ success: true, user: data.user, session: data.session });
    }

    if (action === 'social') {
      // Social login (Google, Meta, LinkedIn, etc.)
      const { data, error } = await supabase.auth.signInWithOAuth({ provider });
      if (error) return res.status(400).json({ error: error.message });
      return res.status(200).json({ success: true, url: data.url });
    }

    if (action === '2fa-init') {
      // Initiate 2FA (send code via email/SMS)
      const twoFACode = generate2FACode();
      const stored = await store2FACode(email, twoFACode, product);
      
      if (!stored) {
        return res.status(500).json({ error: 'Failed to generate 2FA code' });
      }

      const sent = await send2FACode(email, twoFACode, product);
      if (!sent) {
        return res.status(500).json({ error: 'Failed to send 2FA code' });
      }

      return res.status(200).json({ 
        success: true, 
        message: `2FA code sent to ${email}`,
        method 
      });
    }

    if (action === '2fa-verify') {
      // Verify 2FA code
      const isValid = await verify2FACode(email, code, product);
      
      if (!isValid) {
        return res.status(400).json({ error: 'Invalid or expired 2FA code' });
      }

      // Complete login process
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) return res.status(401).json({ error: error.message });

      return res.status(200).json({ 
        success: true, 
        message: '2FA verified successfully',
        user: data.user, 
        session: data.session 
      });
    }

    if (action === 'reset-init') {
      // Initiate password reset (send email)
      const { data, error } = await supabase.auth.resetPasswordForEmail(email);
      if (error) return res.status(400).json({ error: error.message });
      return res.status(200).json({ success: true, message: 'Reset email sent' });
    }

    if (action === 'reset-complete') {
      // Complete password reset (user provides new password and token)
      // This is handled by Supabase's magic link flow
      return res.status(200).json({ success: true, message: 'Reset complete (handled by Supabase)' });
    }

    if (action === 'enable-2fa') {
      // Enable 2FA for a user
      const { error } = await supabase
        .from('users')
        .upsert({
          email,
          product,
          two_factor_enabled: true,
          updated_at: new Date().toISOString()
        });
      
      if (error) return res.status(500).json({ error: 'Failed to enable 2FA' });
      return res.status(200).json({ success: true, message: '2FA enabled' });
    }

    if (action === 'disable-2fa') {
      // Disable 2FA for a user
      const { error } = await supabase
        .from('users')
        .upsert({
          email,
          product,
          two_factor_enabled: false,
          updated_at: new Date().toISOString()
        });
      
      if (error) return res.status(500).json({ error: 'Failed to disable 2FA' });
      return res.status(200).json({ success: true, message: '2FA disabled' });
    }

    return res.status(400).json({ error: 'Invalid action' });
  } catch (error) {
    console.error('Auth error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
} 