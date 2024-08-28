import { useEffect, useState } from 'react';
import { supabase } from '../Services/supabaseClient';
import { string } from 'yup';

export const useSupabaseAuth = () => {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const getSession = async () => {
      const { data: sessionData } = await supabase.auth.getSession();
      setUser(sessionData?.session?.user || null);
    };

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user || null);
      }
    );

    return () => {
        authListener?.subscription?.unsubscribe();
    };
  }, []);

  return { user };
};
