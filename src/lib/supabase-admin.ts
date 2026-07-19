/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { createClient } from '@supabase/supabase-js';

// Server-side Supabase client using the service role key. This client has
// elevated privileges (bypasses RLS) and must NEVER be imported into any
// browser-bound code - it is only safe to use inside server.ts / Express
// route handlers and middleware.
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.error(
    'Missing Supabase server credentials. Please set SUPABASE_URL and ' +
    'SUPABASE_SERVICE_ROLE_KEY in your .env file. Authenticated routes will fail.'
  );
}

export const supabaseAdmin = createClient(
  supabaseUrl || '',
  supabaseServiceRoleKey || '',
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  }
);
