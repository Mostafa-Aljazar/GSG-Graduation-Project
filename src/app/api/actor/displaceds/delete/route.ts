'use server';

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/utils/prisma';
import { verifyJWT } from '@/utils/auth';
import { IActionResponse } from '@/types/common/action-response.type';
import { USER_TYPE } from '@gen/client';
import { USER_RANK_LABELS } from '@/constants/user-types';

interface IDeleteDisplacedsPayload {
    userIds: string[];
}

export async function DELETE(req: NextRequest) {
    try {
        const token = req.headers.get('authorization');
        if (!token) {
            return NextResponse.json({ status: 401, message: 'غير مصرح' }, { status: 401 });
        }

        const verified = verifyJWT(token);
        const { userIds: inputIds } = (await req.json()) as IDeleteDisplacedsPayload;

        if (!inputIds?.length) {
            return NextResponse.json({ status: 400, message: 'البيانات غير كاملة' }, { status: 400 });
        }

        let userIds = inputIds;

        // Manager deletes ALL displaced
        if (verified.role === USER_TYPE.MANAGER) {
            // no filtering
        }

        // Delegate deletes ONLY his displaced
        else if (verified.role === USER_TYPE.DELEGATE) {
            const linked = await prisma.displacedProfile.findMany({
                where: { displacement: { delegateId: verified.id } },
                select: { userId: true },
            });

            const allowed = linked.map(d => d.userId);
            userIds = inputIds.filter(id => allowed.includes(id));

            if (!userIds.length) {
                return NextResponse.json({ status: 403, message: 'غير مسموح بالحذف' }, { status: 403 });
            }
        }

        // No one else can delete
        else {
            return NextResponse.json({ status: 403, message: 'غير مسموح بالحذف' }, { status: 403 });
        }

        await prisma.medicalCondition.deleteMany({ where: { displacedId: { in: userIds } } });
        await prisma.wife.deleteMany({ where: { displacedId: { in: userIds } } });
        await prisma.warInjury.deleteMany({ where: { displacedId: { in: userIds } } });
        await prisma.martyr.deleteMany({ where: { displacedId: { in: userIds } } });

        await prisma.displacedProfile.deleteMany({ where: { userId: { in: userIds } } });

        await prisma.user.deleteMany({ where: { id: { in: userIds } } });

        const response: IActionResponse = {
            status: 200,
            message: `تم حذف ${userIds.length} ${USER_RANK_LABELS.DISPLACED} بنجاح`,
        };

        return NextResponse.json(response, { status: 200 });
    } catch (error: any) {
        return NextResponse.json(
            { status: 500, message: error.message || 'خطأ' },
            { status: 500 },
        );
    }
}

// 'use server';

// import { NextRequest, NextResponse } from 'next/server';
// import { prisma } from '@/utils/prisma';
// import { USER_TYPE, USER_RANK_LABELS } from '@/constants/user-types';
// import { verifyJWT } from '@/utils/auth';
// import { IActionResponse } from '@/types/common/action-response.type';

// interface IDeleteDisplacedsPayload {
//     userIds: string[];
// }

// export async function DELETE(req: NextRequest) {
//     try {
//         const token = req.headers.get('authorization');
//         if (!token)
//             return NextResponse.json({ status: 401, message: 'غير مصرح' }, { status: 401 });

//         const verified = verifyJWT(token);
//         const body = (await req.json()) as IDeleteDisplacedsPayload;
//         let { userIds } = body;

//         if (!userIds?.length)
//             return NextResponse.json({ status: 400, message: 'البيانات غير كاملة' }, { status: 400 });

//         // Role-based access
//         if (verified.role === USER_TYPE.MANAGER) {
//             // manager can delete all
//         } else if (verified.role === USER_TYPE.DELEGATE) {
//             const myDisplacedIds = await prisma.displacedProfile.findMany({
//                 where: { displacement: { delegateId: verified.id } },
//                 select: { userId: true },
//             });
//             const allowedIds = myDisplacedIds.map(d => d.userId);
//             userIds = userIds.filter(id => allowedIds.includes(id));
//             if (!userIds.length)
//                 return NextResponse.json({ status: 403, message: 'غير مسموح بالحذف' }, { status: 403 });
//         } else {
//             return NextResponse.json({ status: 403, message: 'غير مسموح بالحذف' }, { status: 403 });
//         }

//         // Delete child records first
//         await prisma.medicalCondition.deleteMany({
//             where: { displacedId: { in: userIds } },
//         });

//         await prisma.wife.deleteMany({
//             where: { displacedId: { in: userIds } },
//         });

//         await prisma.warInjury.deleteMany({
//             where: { displacedId: { in: userIds } },
//         });

//         await prisma.martyr.deleteMany({
//             where: { displacedId: { in: userIds } },
//         });

//         // If you want to keep Displacement and DisplacedSocialStatus intact, do not delete them
//         // just delete DisplacedProfile
//         await prisma.displacedProfile.deleteMany({
//             where: { userId: { in: userIds } },
//         });

//         // Finally, delete User
//         await prisma.user.deleteMany({
//             where: { id: { in: userIds } },
//         });

//         const response: IActionResponse = {
//             status: 200,
//             message: `تم حذف ${userIds.length} ${USER_RANK_LABELS.DISPLACED} بنجاح`,
//         };
//         return NextResponse.json(response, { status: 200 });

//     } catch (error: any) {
//         return NextResponse.json({ status: 500, message: error.message || 'خطأ', error: error.message || 'خطأ' }, { status: 500 });
//     }
// }
