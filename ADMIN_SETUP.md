# NXT Academy media admin setup

The public media hub works immediately with the media already bundled in the website. Complete these steps once to let the client manage the shared library from `/admin`.

1. Create a Supabase project at `https://supabase.com`.
2. Open **SQL Editor**, paste the contents of `supabase/setup.sql`, and run it once. This creates the media table, public media bucket, access rules, and the initial seven media items.
3. Open **Authentication → Users → Add user** and create the client's admin email and password. Disable public sign-ups for this project.
4. Copy the project URL and anon/public key from **Project Settings → API**.
5. Add these environment variables to the Vercel project for Production, Preview, and Development:

   ```text
   NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
   ```

6. Redeploy the website, then visit `https://nxt-academy2.vercel.app/admin` and sign in with the client account.

The admin can upload images and videos, add YouTube or Facebook video links, provide thumbnails, reorder items, hide or publish them, and delete them. Uploaded files are stored in the public `media` bucket; editing access is limited to authenticated users.

