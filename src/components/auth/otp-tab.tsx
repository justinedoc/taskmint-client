import { zodResolver } from "@hookform/resolvers/zod";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import {
  useResendOtpMutation,
  useVerifyOtpMutation,
} from "@/hooks/use-auth-mutations";

const OTPFormSchema = z.object({
  pin: z.string().min(6, {
    message: "Your one-time password must be 6 characters.",
  }),
});

type TOTPForm = z.infer<typeof OTPFormSchema>;

export default function FormOTP() {
  const [resendCooldown, setResendCooldown] = useState(0);

  // Hook integrations
  // Note: navigateTo logic is handled within useVerifyOtpMutation (defaults to /dashboard)
  const { mutate: verifyOTP, isPending: isVerifying } = useVerifyOtpMutation();
  const { mutate: resendOTP, isPending: isResending } = useResendOtpMutation();

  const OTPForm = useForm<TOTPForm>({
    resolver: zodResolver(OTPFormSchema),
    defaultValues: {
      pin: "",
    },
  });

  // Handle successful resend to set cooldown
  const handleResendClick = () => {
    if (resendCooldown > 0) return;
    resendOTP(undefined, {
      onSuccess: () => {
        const expiresAt = Date.now() + 30_000;
        localStorage.setItem("otp_cooldown_expires_at", expiresAt.toString());
        setResendCooldown(30);
      },
    });
  };

  useEffect(() => {
    const saved = localStorage.getItem("otp_cooldown_expires_at");
    if (saved) {
      const expiresAt = Number(saved);
      const now = Date.now();
      const remaining = Math.ceil((expiresAt - now) / 1000);

      if (remaining > 0) {
        setResendCooldown(remaining);
      }
    }
  }, []);

  useEffect(() => {
    if (resendCooldown <= 0) return;

    const timer = setInterval(() => {
      setResendCooldown((prev) => {
        const next = prev - 1;
        if (next <= 0) {
          localStorage.removeItem("otp_cooldown_expires_at");
          clearInterval(timer);
          return 0;
        }
        return next;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [resendCooldown]);

  function onSubmitOTP(data: TOTPForm) {
    verifyOTP(Number(data.pin), {
      onError: () => {
        OTPForm.resetField("pin");
      },
    });
  }

  return (
    <Form {...OTPForm}>
      <form onSubmit={OTPForm.handleSubmit(onSubmitOTP)} className="space-y-6">
        <FormField
          control={OTPForm.control}
          name="pin"
          render={({ field }) => (
            <FormItem>
              <FormLabel>One-Time Password</FormLabel>
              <FormControl>
                <InputOTP pattern={REGEXP_ONLY_DIGITS} maxLength={6} {...field}>
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                  </InputOTPGroup>
                  <InputOTPSeparator />
                  <InputOTPGroup>
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
              </FormControl>
              <FormDescription>
                Please enter the one-time password sent to your email.
              </FormDescription>
              <FormDescription>
                Didn't receive it?{" "}
                <Button
                  variant={"link"}
                  type="button"
                  disabled={isResending || resendCooldown > 0}
                  onClick={handleResendClick}
                  className="text-foreground disabled:text-foreground/50 px-1 font-medium underline disabled:cursor-not-allowed"
                >
                  {resendCooldown > 0
                    ? `resend in ${resendCooldown}s`
                    : isResending
                      ? "resending..."
                      : "resend OTP"}
                </Button>
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          size={"lg"}
          className="w-full rounded-full"
          disabled={isVerifying}
        >
          {isVerifying ? "Verifying..." : "Verify"}
        </Button>
      </form>
    </Form>
  );
}
