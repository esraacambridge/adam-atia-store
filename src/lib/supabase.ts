import { supabase as client } from '@/integrations/supabase/client';

// The generated Database types don't include this store's tables yet, so the
// store's api.ts queries tables by name on an untyped client.
/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
export const supabase = client as any;
