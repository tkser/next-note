import { useEffect } from "react"
import Cookies from 'js-cookie';
import { useRouter } from "next/navigation";

type AuthWrapperProps = {
  children: React.ReactNode
}

const AuthWrapper = ({ children }: AuthWrapperProps) => {
  const router = useRouter();
  useEffect(() => {
    const token = Cookies.get('token');
    if (!token) {
      router.push('/dashboard/login');
    }
  })
  return (
    <>{children}</>
  )
}

export default AuthWrapper;
