import { Entries } from "./entities/EntriesEntity";
import { Timestamp } from 'firebase/firestore';
import 'firebase/firestore';


const today = new Date();

const EntriesMockData = {
    entries: [
        new Entries({id: '1', arena: '', group: "Perseas1", datetime: Timestamp.fromMillis(today.setHours(12, 0, 0, 0))})
    ]
};

export default EntriesMockData;