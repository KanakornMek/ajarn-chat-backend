import { UrgencyTag } from "@prisma/client";
export default function parseUrgency(ungency: string): UrgencyTag | undefined {
    if(ungency === undefined){
        return undefined;
    }
    switch (ungency.toLowerCase()) {
        case 'urgent':
            return UrgencyTag.urgent;
        case 'regular':
            return UrgencyTag.regular;
        case'lowpriority':
            return UrgencyTag.lowPriority;
        default:
            return undefined;
    }
}