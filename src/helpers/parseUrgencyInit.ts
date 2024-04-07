import { UrgencyTag } from "@prisma/client";

export default function parseUrgencyInit(urgency: string): UrgencyTag| undefined{
    if(urgency === undefined) {
        return undefined;
    }
    switch (urgency.toLowerCase()) {
        case 'urgent':
            return UrgencyTag.urgent;
        case 'regular':
            return UrgencyTag.regular;
        default:
            return UrgencyTag.lowPriority;
    }
}