import { Status} from '@prisma/client';

export default function parseStatus(status: string): Status | undefined {
    switch (status.toLowerCase()) {
        case 'pending':
            return Status.pending;
        case 'answered':
            return Status.answered;
        case 'archived':
            return Status.archived;
        default:
            return undefined;
    }
}

