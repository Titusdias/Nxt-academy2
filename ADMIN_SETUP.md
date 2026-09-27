# NXT Academy media admin setup

The public media hub works immediately with the media already bundled in the website. Complete these steps once to let the client manage the shared library from `/admin`.

1. Create a Supabase project at `https://supabase.com`.
2. Open **SQL Editor**, paste the contents of `supabase/setup.sql`, and run it once. This creates the media table, public media bucket, access rules, the initial YouTube videos, and the campus gallery.
3. Open **Authentication → Users → Add user** and create the client's admin email and password. Disable public sign-ups for this project.
4. Copy the project URL and anon/public key from **Project Settings → API**.
5. Add these environment variables to the Vercel project for Production, Preview, and Development:

   ```text
   NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
   ```

6. Redeploy the website, then visit `https://nxt-academy2.vercel.app/admin` and sign in with the client account.

The admin has two separate collections. **YouTube Videos** accepts YouTube links only and creates thumbnails automatically. **Campus Gallery** accepts image uploads only. Both collections support ordering, hiding, publishing, and deletion. Uploaded campus photos are stored in the public `media` bucket; editing access is limited to authenticated users.

For a Supabase project that already used the older mixed media library, run `supabase/youtube-campus-migration.sql` once. It hides old uploaded, local, and Facebook videos so the database matches the new YouTube-only video section.

