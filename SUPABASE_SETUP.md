# Supabase Setup Checklist

## 1. Create Storage Buckets

### Bucket 1: `videos`
1. Go to Supabase Dashboard → Storage
2. Click "New bucket"
3. Name: `videos`
4. Make public: ✅ YES
5. Click "Create bucket"

### Bucket 2: `thumbnails`
1. Click "New bucket"
2. Name: `thumbnails`
3. Make public: ✅ YES
4. Click "Create bucket"

## 2. Run Database Migration

1. Go to Supabase Dashboard → SQL Editor
2. Click "New query"
3. Copy and paste the contents of: `scripts/08-create-video-trivia-table.sql`
4. Click "Run"

**Expected output**: Successfully created `video_trivia` table with indices and RLS policies

## 3. Verify Database Schema

In SQL Editor, run:
```sql
SELECT * FROM video_trivia LIMIT 1;
```

Should show the table structure with these columns:
- id (UUID)
- video_id (UUID)
- trivia_question_id (UUID)
- display_order (INTEGER)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)

## 4. Test File Upload

1. Go to Admin Dashboard
2. Click "Upload Video"
3. Select "From Device"
4. Upload a test MP4 file
5. Check that:
   - File uploads successfully
   - Progress messages appear
   - Video appears in the list
   - Video can be played with controls

## 5. Test Trivia Linking

1. On an uploaded video, click "?" button
2. See list of available trivia questions
3. Check some questions
4. Play the video to completion
5. Verify trivia questions appear

## Troubleshooting

### Upload fails: "Failed to upload video"
- Check Supabase storage buckets exist
- Check bucket permissions are public
- Check file type is supported
- Check file size < limits (500MB video, 10MB thumbnail)

### Video doesn't play
- Check video URL is valid
- Check video format is supported (MP4, WebM, OGG)
- Check browser console for errors
- Try different video file

### Trivia doesn't appear after video
- Check `/api/admin/video-trivia` returns questions
- Check video has trivia linked in admin panel
- Check browser console for fetch errors

### "Unable to acquire lock" error
- Kill other Next.js processes: `pkill -f "next dev"`
- Clear `.next` directory: `rm -rf .next`
- Restart dev server: `npm run dev`
