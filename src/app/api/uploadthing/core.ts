import { createUploadthing, type FileRouter } from 'uploadthing/next';
import { UploadThingError } from 'uploadthing/server';

const f = createUploadthing();


const auth = (req: Request) => ({ id: 'fakeId' }); // Fake auth function

export const ourFileRouter = {
    mediaUploader: f({
        image: {
            maxFileSize: '4MB',
            maxFileCount: 1,
        },
        // video: {
        //     maxFileSize: '16MB',
        //     maxFileCount: 1,
        // },
    })
        .middleware(async ({ req }) => {
            const user = await auth(req);
            if (!user) throw new UploadThingError('Unauthorized');
            return { userId: user.id };
        })
        .onUploadComplete(async ({ metadata, file }) => {
            console.log('Upload complete for userId:', metadata.userId);
            console.log('file url', file.ufsUrl);
            // Return the file URL to the client-side callback
            return { uploadedBy: metadata.userId, fileUrl: file.ufsUrl };
        }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
