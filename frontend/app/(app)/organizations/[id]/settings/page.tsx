'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Settings, Users, ArrowLeft, Plus, Loader2, Copy, Check, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'

interface Member {
    user_id: string
    role: string
    created_at: string
}

interface Invitation {
    id: string
    email: string
    role: string
    token: string
    expires_at: string
    created_at: string
}

export default function OrganizationSettingsPage() {
    const params = useParams()
    const router = useRouter()
    const orgId = params.id as string

    const [organization, setOrganization] = useState<any>(null)
    const [members, setMembers] = useState<Member[]>([])
    const [invitations, setInvitations] = useState<Invitation[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isInviteModalOpen, setIsInviteModalOpen] = useState(false)
    const [inviteEmail, setInviteEmail] = useState('')
    const [inviteRole, setInviteRole] = useState('member')
    const [isCreatingInvite, setIsCreatingInvite] = useState(false)
    const [copiedToken, setCopiedToken] = useState<string | null>(null)
    const [currentUserRole, setCurrentUserRole] = useState<string>('')

    const supabase = createClient()

    useEffect(() => {
        loadData()
    }, [orgId])

    const loadData = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) return

            // Load organization
            const { data: org } = await supabase
                .from('organizations')
                .select('*')
                .eq('id', orgId)
                .single()

            setOrganization(org)

            // Load members
            const { data: membersData } = await supabase
                .from('organization_members')
                .select('user_id, role, created_at')
                .eq('organization_id', orgId)

            setMembers(membersData || [])

            // Find current user's role
            const userMember = membersData?.find(m => m.user_id === user.id)
            setCurrentUserRole(userMember?.role || '')

            // Load invitations
            const { data: invData } = await supabase
                .from('organization_invitations')
                .select('*')
                .eq('organization_id', orgId)
                .eq('status', 'pending')
                .order('created_at', { ascending: false })

            setInvitations(invData || [])
        } catch (error) {
            console.error('Error loading data:', error)
            toast.error('Failed to load organization data')
        } finally {
            setIsLoading(false)
        }
    }

    const createInvitation = async () => {
        if (!inviteEmail) {
            toast.error('Please enter an email address')
            return
        }

        setIsCreatingInvite(true)
        try {
            const expiresAt = new Date()
            expiresAt.setDate(expiresAt.getDate() + 7)

            const { data, error } = await supabase
                .from('organization_invitations')
                .insert({
                    organization_id: orgId,
                    email: inviteEmail,
                    role: inviteRole,
                    expires_at: expiresAt.toISOString(),
                    status: 'pending'
                })
                .select()
                .single()

            if (error) throw error

            toast.success('Invitation created! Copy the link below.')
            setInviteEmail('')
            setIsInviteModalOpen(false)
            loadData()

            // Show the invitation link
            if (data) {
                const inviteLink = `${window.location.origin}/invite/accept?token=${data.token}`
                navigator.clipboard.writeText(inviteLink)
                toast.success('Invitation link copied to clipboard!')
            }
        } catch (error: any) {
            console.error('Error creating invitation:', error)
            toast.error(error.message || 'Failed to create invitation')
        } finally {
            setIsCreatingInvite(false)
        }
    }

    const copyInviteLink = (token: string) => {
        const inviteLink = `${window.location.origin}/invite/accept?token=${token}`
        navigator.clipboard.writeText(inviteLink)
        setCopiedToken(token)
        toast.success('Invitation link copied!')
        setTimeout(() => setCopiedToken(null), 2000)
    }

    const revokeInvitation = async (invitationId: string) => {
        try {
            const { error } = await supabase
                .from('organization_invitations')
                .update({ status: 'revoked' })
                .eq('id', invitationId)

            if (error) throw error

            toast.success('Invitation revoked')
            loadData()
        } catch (error: any) {
            console.error('Error revoking invitation:', error)
            toast.error('Failed to revoke invitation')
        }
    }

    const removeMember = async (userId: string) => {
        if (!confirm('Are you sure you want to remove this member?')) return

        try {
            const { error } = await supabase
                .from('organization_members')
                .delete()
                .eq('organization_id', orgId)
                .eq('user_id', userId)

            if (error) throw error

            toast.success('Member removed')
            loadData()
        } catch (error: any) {
            console.error('Error removing member:', error)
            toast.error('Failed to remove member')
        }
    }

    const updateMemberRole = async (userId: string, newRole: string) => {
        try {
            const { error } = await supabase
                .from('organization_members')
                .update({ role: newRole })
                .eq('organization_id', orgId)
                .eq('user_id', userId)

            if (error) throw error

            toast.success('Role updated')
            loadData()
        } catch (error: any) {
            console.error('Error updating role:', error)
            toast.error('Failed to update role')
        }
    }

    const isAdmin = currentUserRole === 'owner' || currentUserRole === 'admin'

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-secondary/30 p-6">
            <div className="max-w-4xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => router.push('/dashboard')}
                    >
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <div className="flex-1">
                        <h1 className="text-3xl font-bold">{organization?.name}</h1>
                        <p className="text-muted-foreground">Organization Settings</p>
                    </div>
                </div>

                {/* Team Members */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="flex items-center gap-2">
                                    <Users className="h-5 w-5" />
                                    Team Members
                                </CardTitle>
                                <CardDescription>
                                    Manage who has access to this organization
                                </CardDescription>
                            </div>
                            {isAdmin && (
                                <Button onClick={() => setIsInviteModalOpen(true)}>
                                    <Plus className="h-4 w-4 mr-2" />
                                    Invite Member
                                </Button>
                            )}
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {members.map((member) => (
                                <div
                                    key={member.user_id}
                                    className="flex items-center justify-between p-3 rounded-lg border bg-card"
                                >
                                    <div className="flex-1">
                                        <p className="font-medium">{member.user_id}</p>
                                        <p className="text-sm text-muted-foreground">
                                            Joined {new Date(member.created_at).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        {isAdmin ? (
                                            <Select
                                                value={member.role}
                                                onValueChange={(value) => updateMemberRole(member.user_id, value)}
                                            >
                                                <SelectTrigger className="w-32">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="owner">Owner</SelectItem>
                                                    <SelectItem value="admin">Admin</SelectItem>
                                                    <SelectItem value="member">Member</SelectItem>
                                                    <SelectItem value="viewer">Viewer</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        ) : (
                                            <Badge variant="secondary">{member.role}</Badge>
                                        )}
                                        {isAdmin && (
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => removeMember(member.user_id)}
                                            >
                                                <Trash2 className="h-4 w-4 text-destructive" />
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Pending Invitations */}
                {isAdmin && invitations.length > 0 && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Pending Invitations</CardTitle>
                            <CardDescription>
                                Invitations that haven't been accepted yet
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {invitations.map((invitation) => (
                                    <div
                                        key={invitation.id}
                                        className="flex items-center justify-between p-3 rounded-lg border bg-card"
                                    >
                                        <div className="flex-1">
                                            <p className="font-medium">{invitation.email}</p>
                                            <p className="text-sm text-muted-foreground">
                                                Expires {new Date(invitation.expires_at).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <Badge variant="outline">{invitation.role}</Badge>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => copyInviteLink(invitation.token)}
                                            >
                                                {copiedToken === invitation.token ? (
                                                    <Check className="h-4 w-4" />
                                                ) : (
                                                    <Copy className="h-4 w-4" />
                                                )}
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => revokeInvitation(invitation.id)}
                                            >
                                                <Trash2 className="h-4 w-4 text-destructive" />
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>

            {/* Invite Modal */}
            <Dialog open={isInviteModalOpen} onOpenChange={setIsInviteModalOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Invite Team Member</DialogTitle>
                        <DialogDescription>
                            Send an invitation to join your organization
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email Address</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="colleague@company.com"
                                value={inviteEmail}
                                onChange={(e) => setInviteEmail(e.target.value)}
                                disabled={isCreatingInvite}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="role">Role</Label>
                            <Select value={inviteRole} onValueChange={setInviteRole}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="admin">Admin</SelectItem>
                                    <SelectItem value="member">Member</SelectItem>
                                    <SelectItem value="viewer">Viewer</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setIsInviteModalOpen(false)}
                            disabled={isCreatingInvite}
                        >
                            Cancel
                        </Button>
                        <Button onClick={createInvitation} disabled={isCreatingInvite}>
                            {isCreatingInvite ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Creating...
                                </>
                            ) : (
                                'Create Invitation'
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
