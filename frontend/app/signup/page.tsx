'use client'

import { useState } from 'react'
import { Leaf, Loader2 } from "lucide-react"
import Link from "next/link"
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'

export default function SignupPage() {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [isGoogleLoading, setIsGoogleLoading] = useState(false)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const supabase = createClient()

    const handleEmailSignup = async (e: React.FormEvent) => {
        e.preventDefault()

        if (password !== confirmPassword) {
            toast.error('Passwords do not match')
            return
        }

        if (password.length < 6) {
            toast.error('Password must be at least 6 characters')
            return
        }

        setIsLoading(true)

        try {
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    emailRedirectTo: `${window.location.origin}/auth/callback`,
                },
            })

            if (error) {
                toast.error(error.message)
            } else {
                toast.success('Account created! Please check your email to verify your account.')
                router.push('/login')
            }
        } catch (error) {
            toast.error('An unexpected error occurred')
        } finally {
            setIsLoading(false)
        }
    }

    const handleGoogleSignup = async () => {
        setIsGoogleLoading(true)

        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: `${window.location.origin}/auth/callback`,
                },
            })

            if (error) {
                toast.error(error.message)
                setIsGoogleLoading(false)
            }
        } catch (error) {
            toast.error('An unexpected error occurred')
            setIsGoogleLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-secondary/30 p-4">
            <Card className="w-full max-w-md shadow-medium border-0">
                <CardHeader className="space-y-4 text-center">
                    <div className="flex justify-center">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl gradient-eco">
                            <Leaf className="h-6 w-6 text-white" />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <CardTitle className="text-2xl font-bold tracking-tight">Create Account</CardTitle>
                        <CardDescription>
                            Start your environmental compliance journey
                        </CardDescription>
                    </div>
                </CardHeader>
                <form onSubmit={handleEmailSignup}>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email Address</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="name@company.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                disabled={isLoading}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                disabled={isLoading}
                                minLength={6}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="confirm-password">Confirm Password</Label>
                            <Input
                                id="confirm-password"
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                                disabled={isLoading}
                                minLength={6}
                            />
                        </div>
                        <Button
                            type="submit"
                            className="w-full gradient-eco text-white border-0 mt-4 h-11"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Creating account...
                                </>
                            ) : (
                                'Sign Up'
                            )}
                        </Button>
                        <div className="relative my-4">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
                            </div>
                        </div>
                        <Button
                            type="button"
                            variant="outline"
                            className="w-full h-11"
                            onClick={handleGoogleSignup}
                            disabled={isLoading || isGoogleLoading}
                        >
                            {isGoogleLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Connecting...
                                </>
                            ) : (
                                'Google'
                            )}
                        </Button>
                    </CardContent>
                </form>
                <CardFooter className="flex flex-col space-y-4 text-center text-sm text-muted-foreground">
                    <p>
                        Already have an account?{" "}
                        <Link href="/login" className="text-primary hover:underline font-medium">
                            Sign in here
                        </Link>
                    </p>
                </CardFooter>
            </Card>
        </div>
    )
}
