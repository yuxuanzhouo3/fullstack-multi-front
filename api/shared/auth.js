import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

// Create Supabase client only if environment variables are available
let supabase = null;
if (supabaseUrl && supabaseKey) {
  supabase = createClient(supabaseUrl, supabaseKey);
} else {
  console.warn('Supabase environment variables not set. Using mock authentication.');
}

function getProductFromHost(req) {
  const host = req.headers.host || '';
  const match = host.match(/^([a-z0-9-]+)\./i);
  return match ? match[1] : 'dashboard';
}

// Generate 6-digit code for 2FA
function generate2FACode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Mock functions for testing without Supabase
async function mockAuth(action, email, password, name, product) {
  if (action === 'signup') {
    return {
      success: true,
      user: {
        id: 'mock-user-id',
        email: email,
        user_metadata: { name: name, product: product }
      }
    };
  }
  
  if (action === 'login') {
    // Mock login - accept any valid email/password
    if (email && password && password.length >= 6) {
      return {
        success: true,
        user: {
          id: 'mock-user-id',
          email: email,
          user_metadata: { product: product }
        },
        session: {
          access_token: 'mock-token',
          refresh_token: 'mock-refresh-token'
        }
      };
    } else {
      return {
        success: false,
        error: 'Invalid credentials'
      };
    }
  }
  
  return {
    success: false,
    error: 'Invalid action'
  };
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { action, email, password, name, provider, code, method = 'email' } = req.body;
  const product = getProductFromHost(req);

  try {
    // If Supabase is not configured, use mock authentication
    if (!supabase) {
      const result = await mockAuth(action, email, password, name, product);
      
      if (result.success) {
        return res.status(200).json(result);
      } else {
        return res.status(400).json({ error: result.error });
      }
    }

    // Real Supabase authentication
    if (action === 'signup') {
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
      const { data, error } = await supabase.auth.signInWithOAuth({ provider });
      if (error) return res.status(400).json({ error: error.message });
      return res.status(200).json({ success: true, url: data.url });
    }

    if (action === '2fa-init') {
      // Mock 2FA for now
      const twoFACode = generate2FACode();
      console.log(`2FA code ${twoFACode} sent to ${email} for product ${product}`);
      return res.status(200).json({ 
        success: true, 
        message: `2FA code sent to ${email}`,
        method,
        code: twoFACode // For testing only - remove in production
      });
    }

    if (action === '2fa-verify') {
      // Mock 2FA verification
      if (code && code.length === 6) {
        return res.status(200).json({ 
          success: true, 
          message: '2FA verified successfully'
        });
      } else {
        return res.status(400).json({ error: 'Invalid verification code' });
      }
    }

    if (action === 'reset-init') {
      if (supabase) {
        const { data, error } = await supabase.auth.resetPasswordForEmail(email);
        if (error) return res.status(400).json({ error: error.message });
        return res.status(200).json({ success: true, message: 'Reset email sent' });
      } else {
        return res.status(200).json({ success: true, message: 'Reset email sent (mock)' });
      }
    }

    if (action === 'reset-complete') {
      return res.status(200).json({ success: true, message: 'Reset complete (handled by Supabase)' });
    }

    if (action === 'enable-2fa') {
      if (supabase) {
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
      } else {
        return res.status(200).json({ success: true, message: '2FA enabled (mock)' });
      }
    }

    if (action === 'disable-2fa') {
      if (supabase) {
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
      } else {
        return res.status(200).json({ success: true, message: '2FA disabled (mock)' });
      }
    }

    return res.status(400).json({ error: 'Invalid action' });
  } catch (error) {
    console.error('Auth error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
} 