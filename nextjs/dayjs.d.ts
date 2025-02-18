import 'dayjs-plugin-weekofyear';

declare module 'dayjs' {
    interface Dayjs {
        week(): number;
    }
}