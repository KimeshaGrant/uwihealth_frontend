import { toast } from "sonner";

export const notifyBooking = () => {
    toast.success("Appointment booked successfully");
};

export const notifyCancel = () => {
    toast.success("Appointment Cancelled");
};

// export const notifyReminder = () => {
// toast.success("Reminder: You have an appointment in 1 hour.");
// };

export const notifyCheckIn = () => {
    toast.success("Checked into queue");
};

export const notifyError = (message:string) => {
    toast.success(message);
};
