import { supabase } from '../utils/supabase';

export default async function handler(req, res) {
  const { method } = req;

  switch (method) {
    case 'POST':
      const { action, email, password, userData } = req.body;

      switch (action) {
        case 'signup':
          try {
            const { data, error } = await supabase.auth.signUp({
              email,
              password,
              options: {
                data: userData
              }
            });

            if (error) throw error;

            res.status(200).json({ 
              success: true, 
              user: data.user,
              message: 'User registered successfully' 
            });
          } catch (error) {
            res.status(400).json({ 
              success: false, 
              error: error.message 
            });
          }
          break;

        case 'signin':
          try {
            const { data, error } = await supabase.auth.signInWithPassword({
              email,
              password
            });

            if (error) throw error;

            res.status(200).json({ 
              success: true, 
              user: data.user,
              session: data.session,
              message: 'User signed in successfully' 
            });
          } catch (error) {
            res.status(400).json({ 
              success: false, 
              error: error.message 
            });
          }
          break;

        case 'signout':
          try {
            const { error } = await supabase.auth.signOut();
            if (error) throw error;

            res.status(200).json({ 
              success: true, 
              message: 'User signed out successfully' 
            });
          } catch (error) {
            res.status(400).json({ 
              success: false, 
              error: error.message 
            });
          }
          break;

        default:
          res.status(400).json({ 
            success: false, 
            error: 'Invalid action' 
          });
      }
      break;

    case 'GET':
      // Get current user session
      try {
        const { data: { user }, error } = await supabase.auth.getUser();
        
        if (error) throw error;

        res.status(200).json({ 
          success: true, 
          user: user || null 
        });
      } catch (error) {
        res.status(400).json({ 
          success: false, 
          error: error.message 
        });
      }
      break;

    default:
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).json({ 
        success: false, 
        error: `Method ${method} Not Allowed` 
      });
  }
} 