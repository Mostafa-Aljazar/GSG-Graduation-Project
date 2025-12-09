import { DISPLACED_RECEIVED_AIDS_TABS, TYPE_AIDS } from "../../common/index.type";
import { IPagination } from "@/types/common/pagination.type";

export interface IDisplacedReceivedAid {
    id: string;
    tabType: DISPLACED_RECEIVED_AIDS_TABS;
    aidName: string;
    aidType: TYPE_AIDS;
    aidContent: string;
    deliveryLocation: string;
    deliveryDate: Date | string;
    receiptDate?: Date;
    aidGiver: {
        giverId: string;
        name: string;
        role: "DELEGATE" | "MANAGER";
        // role: Exclude<USER_TYPE, USER_TYPE.DISPLACED | USER_TYPE.SECURITY_PERSON>;
    };
}

export interface IDisplacedReceivedAidsResponse {
    status: number;
    message?: string;
    error?: string;
    receivedAids: IDisplacedReceivedAid[];
    pagination: IPagination
}


