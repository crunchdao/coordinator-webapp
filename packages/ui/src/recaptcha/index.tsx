import Turnstile from "react-turnstile";

const TURNSTILE_SITE_KEY: string | undefined =
  process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

const ReCaptcha: React.FC<{
  onVerify: (token: string) => void;
}> = ({ onVerify }) => {
  if (!TURNSTILE_SITE_KEY) {
    return (
      <pre className="text-destructive">Recaptcha site key is missing</pre>
    );
  }

  return <Turnstile sitekey={TURNSTILE_SITE_KEY} onVerify={onVerify} />;
};

export default ReCaptcha;
