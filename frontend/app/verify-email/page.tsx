'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Leaf, CheckCircle, Mail } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'

export default function VerifyEmailPage() {
    const router = useRouter()
    const supabase = createClient()

    useEffect(() => {
        // Check if user is already verified
        const checkVerification = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            if (user?.email_confirmed_at) {
                router.push('/organizations')
            }
        }
        checkVerification()
    }, [router, supabase])

    const resendVerification = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user?.email) {
                toast.error('No email found')
                return
            }

            const { error } = await supabase.auth.resend({
                type: 'signup',
                email: user.email,
            })

            if (error) throw error
            toast.success('Verification email sent! Check your inbox.')
        } catch (error: any) {
            toast.error(error.message || 'Failed to resend email')
        }
    }

    const signOut = async () => {
        await supabase.auth.signOut()
        router.push('/login')
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-secondary/30 p-4">
            <Card className="w-full max-w-md shadow-medium border-0">
                <CardHeader className="text-center space-y-4">
                    <div className="flex justify-center">
                        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
                            <Mail className="h-8 w-8 text-primary" />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <CardTitle className="text-2xl font-bold">Verify Your Email</CardTitle>
                        <CardDescription>
                            We sent a verification link to your email address. Please check your inbox and spam folder.
                        </CardDescription>
                    </div>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="bg-accent/50 border border-accent rounded-lg p-4">
                        <div className="flex items-start gap-3">
                            <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                            <div className="space-y-1 text-sm">
                                <p className="font-medium">Next Steps:</p>
                                <ol className="list-decimal list-inside space-y-1 text-muted-foreground">
                                    <li>Check your email inbox</li>
                                    <li>Click the verification link</li>
                                    <li>Return here to continue</li>
                                </ol>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <Button
                            onClick={resendVerification}
                            variant="outline"
                            className="w-full"
                        >
                            Resend Verification Email
                        </Button>

                        <Button
                            onClick={signOut}
                            variant="ghost"
                            className="w-full"
                        >
                            Sign Out
                        </Button>
                    </div>

                    <div className="flex items-center gap-2 justify-center">
                        <Leaf className="h-4 w-4 text-primary" />
                        <span className="text-sm font-medium text-muted-foreground">AMBIENTALIST</span>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
