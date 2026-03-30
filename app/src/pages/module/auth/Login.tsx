import { type FormEvent, useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Lock, Mail, Eye, EyeOff } from "lucide-react"
import { COMPANY_LOGO_PATH } from "@/constants/branding"
import { useToast } from "@/context/toast"
import { apiFetch } from "@/lib/api"
import { useAuth, type UserProfile } from "@/context/auth"

export default function LoginPage() {
    const [showPassword, setShowPassword] = useState(false)
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)
    const navigate = useNavigate()
    const location = useLocation()
    const { showToast } = useToast()
    const { login, isAuthenticated } = useAuth()
    const redirectPath = (location.state as { from?: { pathname: string } })?.from?.pathname ?? "/dashboard"

    useEffect(() => {
        if (isAuthenticated) {
            navigate(redirectPath, { replace: true })
        }
    }, [navigate, redirectPath, isAuthenticated])

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        setIsSubmitting(true)

        try {
            const data = await apiFetch<{ accessToken: string; user: UserProfile }>("/login", {
                method: "POST",
                body: JSON.stringify({ email, password }),
            })

            // Unified login via context
            login(data.accessToken, data.user)
            
            showToast({ type: "success", message: "Signed in successfully" })
            navigate(redirectPath, { replace: true })
        } catch (err) {
            const message = err instanceof Error ? err.message : "Unexpected error, please try again"
            showToast({ type: "error", message })
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="flex min-h-screen w-full bg-background overflow-hidden">
            {/* Left Side: Branding/Visuals */}
            <div className="hidden lg:flex lg:w-1/2 relative bg-neutral-950 items-center justify-center p-12 overflow-hidden">
                {/* Decorative Gradients */}
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_20%,oklch(0.55_0.22_25)_0%,transparent_50%)] opacity-25" />
                <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_70%_80%,oklch(0.4_0.15_25)_0%,transparent_50%)] opacity-25" />

                {/* Floating UI Elements Simulation */}
                <div className="absolute top-1/4 -left-12 size-64 bg-primary/20 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-1/4 -right-12 size-64 bg-red-500/10 rounded-full blur-3xl animate-pulse delay-700" />

                <div className="relative z-10 max-w-lg text-center">
                    <div className="inline-flex items-center justify-center p-4 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 mb-8 shadow-2xl animate-bounce-slow">
                        <img src={COMPANY_LOGO_PATH} alt="Licentra logo" className="size-12 object-contain" />
                    </div>
                    <h1 className="text-5xl font-extrabold text-white tracking-tight mb-6 leading-[1.1]">
                        Elevate Your Business with <span className="text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.3)] underline decoration-primary decoration-4 underline-offset-8">Licentra</span>
                    </h1>
                    <p className="text-red-100/70 text-lg font-medium leading-relaxed mb-10">
                        The most advanced customer engagement platform for growing teams. Manage leads, track deals, and boost productivity in one seamless workspace.
                    </p>

                </div>

                {/* Footer text in branding side */}
                <div className="absolute bottom-8 text-white/30 text-xs font-bold tracking-widest uppercase">
                    &copy; 2026 Licentra &bull; All Rights Reserved
                </div>
            </div>

            {/* Right Side: Login Form */}
            <div className="flex-1 flex items-center justify-center p-6 sm:p-12 relative overflow-hidden bg-neutral-50/50">
                {/* Mobile/Tablet Background Pattern - Reddish Subtle */}
                <div className="absolute inset-0 bg-[radial-gradient(oklch(0.55_0.22_25)_0.5px,transparent_0.5px)] [background-size:20px_20px] opacity-[0.03] lg:hidden" />

                <div className="w-full max-w-md relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-1000">
                    <div className="lg:hidden flex flex-col items-center gap-2 mb-10 justify-center">
                        <div className="size-12 bg-white flex items-center justify-center rounded-2xl text-white shadow-xl shadow-primary/20 p-2">
                            <img src={COMPANY_LOGO_PATH} alt="Licentra logo" className="h-full w-full object-contain" />
                        </div>
                        <div className="flex flex-col items-center">
                            <span className="text-2xl font-black tracking-tighter text-slate-900">LICENTRA</span>
                            <span className="text-[10px] uppercase font-bold tracking-[0.3em] text-primary">Platform</span>
                        </div>
                    </div>

                    <Card className="border-none shadow-[0_20px_50px_rgba(0,0,0,0.06)] bg-white/80 backdrop-blur-xl rounded-3xl overflow-hidden">
                        <CardHeader className="space-y-2 pb-8 pt-8 px-8">
                            <CardTitle className="text-3xl font-extrabold tracking-tight text-slate-900">Sign In</CardTitle>
                            <CardDescription className="text-slate-500 font-medium text-base">
                                Enter your credentials to access your account.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="px-8 space-y-5">
                            <form className="space-y-4" onSubmit={handleSubmit}>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700 ml-1">Email Address</label>
                                    <div className="relative group">
                                        <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4.5 text-slate-400 group-focus-within:text-primary transition-colors" />
                                        <Input
                                            type="email"
                                            value={email}
                                            onChange={event => setEmail(event.target.value)}
                                            placeholder="name@company.com"
                                            className="h-12 pl-11 rounded-2xl bg-slate-50 border-slate-200 focus-visible:bg-white focus-visible:ring-primary/20 transition-all font-medium"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center mb-1">
                                        <label className="text-sm font-bold text-slate-700 ml-1">Password</label>
                                    </div>
                                    <div className="relative group">
                                        <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4.5 text-slate-400 group-focus-within:text-primary transition-colors" />
                                        <Input
                                            type={showPassword ? "text" : "password"}
                                            value={password}
                                            onChange={event => setPassword(event.target.value)}
                                            placeholder="••••••••"
                                            className="h-12 pl-11 pr-11 rounded-2xl bg-slate-50 border-slate-200 focus-visible:bg-white focus-visible:ring-primary/20 transition-all font-medium"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                                        >
                                            {showPassword ? <EyeOff className="size-4.5" /> : <Eye className="size-4.5" />}
                                        </button>
                                    </div>
                                </div>
                                <Button
                                    type="submit"
                                    disabled={isSubmitting || !email || !password}
                                    className="w-full h-12 rounded-2xl text-base font-bold shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all duration-300 transform active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed">
                                    {isSubmitting ? "Signing In..." : "Sign In"}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
