import { Status} from '@prisma/client';

export default function parseStatus(status: string): Status | undefined {
    switch (status.toLowerCase()) {
        case 'pending':
            return Status.pending;
        case 'answers':
            return Status.answered;
        case 'archieved':
            return Status.archived;
        default:
            return undefined;
    }
}

