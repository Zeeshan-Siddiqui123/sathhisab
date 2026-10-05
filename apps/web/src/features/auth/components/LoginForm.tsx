import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { AuthLayout } from "@/components/layout/AuthLayout";
import { Input } from "@/components/ui/Input";
import { PasswordInput } from "@/components/ui/PasswordInput";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import { Stack } from "@/components/ui/Stack";
import { Text } from "@/components/ui/Text";
import { useLogin } from "../hooks";

const schema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(1, "Password is required"),
});
type FormValues = z.infer<typeof schema>;

export function LoginForm() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const redirect = params.get("redirect") || "/";
  const login = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormValues) => {
    await login.mutateAsync(data);
    navigate(redirect, { replace: true });
  };

  return (
    <AuthLayout title="Welcome back">
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <Stack className="mt-6">
          {login.error && (
            <Alert tone="danger" title="Login failed">
              {(login.error as Error).message}
            </Alert>
          )}
          <Input
            id="login-email"
            label="Email"
            type="email"
            autoComplete="email"
            autoFocus
            isInvalid={!!errors.email}
            errorMessage={errors.email?.message}
            {...register("email")}
          />
          <PasswordInput
            id="login-password"
            label="Password"
            autoComplete="current-password"
            isInvalid={!!errors.password}
            errorMessage={errors.password?.message}
            {...register("password")}
          />
          <Button
            id="login-submit"
            type="submit"
            color="primary"
            fullWidth
            isLoading={isSubmitting || login.isPending}
          >
            Sign in
          </Button>
          <Text size="sm" className="text-center">
            Don&apos;t have an account?{" "}
            <Link to="/signup" className="text-primary underline">
              Sign up
            </Link>
          </Text>
        </Stack>
      </form>
    </AuthLayout>
  );
}
