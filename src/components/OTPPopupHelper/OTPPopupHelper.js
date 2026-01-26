import Swal from "sweetalert2";

/**
 * @param {Object} options
 * @param {string} options.title
 * @param {function(string): Promise<void>} options.onVerify
 * @param {function(): Promise<void>} options.onResend
 * @param {number} options.expireSeconds
 */
export const showOTPPopup = ({ title, onVerify, onResend, expireSeconds = 300 }) => {
    let timer = expireSeconds;
    let intervalId = null;

    return Swal.fire({
        title,
        input: "text",
        inputPlaceholder: "Nhập OTP",
        showCancelButton: true,
        confirmButtonText: "Xác nhận",
        showDenyButton: true,
        denyButtonText: `Gửi lại (${timer}s)`,
        allowOutsideClick: false,
        allowEscapeKey: false,

        didOpen: () => {
            const denyBtn = Swal.getDenyButton();
            denyBtn.disabled = true;

            intervalId = setInterval(() => {
                timer--;

                denyBtn.textContent = timer > 0 ? `Gửi lại (${timer}s)` : "Gửi lại";

                if (timer <= 0) {
                    denyBtn.disabled = false;
                    clearInterval(intervalId);
                }
            }, 1000);
        },

        preConfirm: async (otp) => {
            if (!otp) {
                Swal.showValidationMessage("Vui lòng nhập OTP");
                return false;
            }

            try {
                await onVerify(otp);
            } catch (e) {
                Swal.showValidationMessage(e.message || "OTP không hợp lệ");
                return false;
            }
        },
    }).then(async (result) => {
        clearInterval(intervalId);

        if (result.isDenied) {
            await onResend();

            // mở lại popup, reset timer
            return showOTPPopup({
                title,
                onVerify,
                onResend,
                expireSeconds,
            });
        }
    });
};
