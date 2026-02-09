'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Loader2, CheckCircle, XCircle, Building2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'

export default function AcceptInvitationPage() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const token = searchParams.get('token')

    const [isLoading, setIsLoading] = useState(true)
    const [invitation, setInvitation] = useState<any>(null)
    const [error, setError] = useState<string | null>(null)
    const [isAccepting, setIsAccepting] = useState(false)

    const supabase = createClient()

    useEffect(() => {
        if (token) {
            validateInvitation()
        } else {
            setError('Invalid invitation link')
            setIsLoading(false)
        }
    }, [token])

    const validateInvitation = async () => {
        try {
            const { data, error } = await supabase
                .from('organization_invitations')
                .select('*, organizations(id, name, slug)')
                .eq('token', token)
                .eq('status', 'pending')
                .single()

            if (error || !data) {
                setError('Invitation not found or already used')
                setIsLoading(false)
                return
            }

            // Check if expired
            const expiresAt = new Date(data.expires_at)
            if (expiresAt < new Date()) {
                setError('This invitation has expired')
                setIsLoading(false)
                return
            }

            setInvitation(data)

            // Check if user is logged in
            const { data: { user } } = await supabase.auth.getUser()

            if (user) {
                // Check if user email matches invitation
                if (user.email !== data.email) {
                    setError(`This invitation was sent to ${data.email}. Please log in with that account.`)
                    setIsLoading(false)
                    return
                }

                // Auto-accept if logged in with correct email
                acceptInvitation()
            } else {
                // Not logged in, show signup/login options
                setIsLoading(false)
            }
        } catch (error: any) {
            console.error('Error validating invitation:', error)
            setError('Failed to validate invitation')
            setIsLoading(false)
        }
    }

    const acceptInvitation = async () => {
        setIsAccepting(true)
        try {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) {
                // Redirect to signup with return URL
                router.push(`/signup?returnTo=${encodeURIComponent(`/invite/accept?token=${token}`)}`)
                return
            }

            // Add user to organization
            const { error: memberError } = await supabase
                .from('organization_members')
                .insert({
                    organization_id: invitation.organizations.id,
                    user_id: user.id,
                    role: invitation.role
                })

            if (memberError) {
                // Check if already a member
                if (memberError.code === '23505') {
                    toast.error('You are already a member of this organization')
                } else {
                    throw memberError
                }
            }

            // Mark invitation as accepted
            await supabase
                .from('organization_invitations')
                .update({
                    status: 'accepted',
                    accepted_at: new Date().toISOString()
                })
                .eq('id', invitation.id)

            toast.success(`You've joined ${invitation.organizations.name}!`)

            // Store selected organization
            localStorage.setItem('selectedOrganization', invitation.organizations.id)

            // Redirect to dashboard
            setTimeout(() => {
                router.push('/dashboard')
            }, 1000)
        } catch (error: any) {
            console.error('Error accepting invitation:', error)
            toast.error(error.message || 'Failed to accept invitation')
            setIsAccepting(false)
        }
    }

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-secondary/30">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-secondary/30 p-4">
                <Card className="w-full max-w-md shadow-medium border-0">
                    <CardHeader className="text-center space-y-4">
                        <div className="flex justify-center">
                            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-destructive/10">
                                <XCircle className="h-8 w-8 text-destructive" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <CardTitle className="text-2xl font-bold">Invalid Invitation</CardTitle>
                            <CardDescription>{error}</CardDescription>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <Button
                            onClick={() => router.push('/login')}
                            variant="outline"
                            className="w-full"
                        >
                            Go to Login
                        </Button>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-secondary/30 p-4">
            <Card className="w-full max-w-md shadow-medium border-0">
                <CardHeader className="text-center space-y-4">
                    <div className="flex justify-center">
                        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
                            <Building2 className="h-8 w-8 text-primary" />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <CardTitle className="text-2xl font-bold">You're Invited!</CardTitle>
                        <CardDescription>
                            Join <span className="font-semibold">{invitation?.organizations?.name}</span> on AmbientaList
                        </CardDescription>
                    </div>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="bg-accent/50 border border-accent rounded-lg p-4">
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Email:</span>
                                <span className="font-medium">{invitation?.email}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Role:</span>
                                <span className="font-medium capitalize">{invitation?.role}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Expires:</span>
                                <span className="font-medium">
                                    {new Date(invitation?.expires_at).toLocaleDateString()}
                                </span>
                            </div>
                        </div>
                    </div>

                    <Button
                        onClick={acceptInvitation}
                        className="w-full gradient-eco text-white border-0"
                        disabled={isAccepting}
                    >
                        {isAccepting ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Joining...
                            </>
                        ) : (
                            'Accept Invitation'
                        )}
                    </Button>

                    <div className="text-center text-sm text-muted-foreground">
                        Don't have an account?{' '}
                        <Button
                            variant="link"
                            className="p-0 h-auto"
                            onClick={() => router.push(`/signup?returnTo=${encodeURIComponent(`/invite/accept?token=${token}`)}`)}
                        >
                            Sign up here
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
