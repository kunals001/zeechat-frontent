import Image from "next/image"
import FloatingShape from "./FloatingShape"

const AuthLayout = ({children}: {children: React.ReactNode}) => {
  return (
    <div className="w-full h-screen overflow-hidden relative">
        <div className="w-full h-full relative">
            <Image src={"/authimage.avif"} alt="auth-bg" width={1920} height={1080} className="w-full h-screen object-cover" />

            <FloatingShape color='bg-gradient-to-r from-purple-500 to-blue-500' size='w-64 h-64' top='-5%' left='20%' delay={0} />
			<FloatingShape color='bg-purple-600' size='w-48 h-48' top='70%' left='80%' delay={5} />
			<FloatingShape color='bg-green-300' size='w-50 h-50' top='50%' left='2%' delay={10} />

            <div className="absolute top-0 left-0 w-full h-full backdrop-blur-xl"></div>
        </div>

        <div className="flex items-center justify-center w-full h-full absolute top-0 left-0">
            {children}
        </div>
    </div>
  )
}

export default AuthLayout