'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Building2, Plus, Loader2 } from 'lucide-react'
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
    DialogTrigger,
} from '@/components/ui/dialog'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'

interface Organization {
    id: string
    name: string
    slug: string
    description: string | null
}

export default function OrganizationSelector() {
    const [organizations, setOrganizations] = useState<Organization[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isCreating, setIsCreating] = useState(false)
    const [newOrgName, setNewOrgName] = useState('')
    const [newOrgDescription, setNewOrgDescription] = useState('')
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const supabase = createClient()
    const router = useRouter()

    useEffect(() => {
        loadOrganizations()
    }, [])

    const loadOrganizations = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) {
                console.log('No authenticated user found')
                setOrganizations([])
                setIsLoading(false)
                return
            }

            console.log('Loading organizations for user ID:', user.id)

            // Get organizations where user is a member
            const { data, error } = await supabase
                .from('organization_members')
                .select(`
          organization_id,
          organizations (
            id,
            name,
            slug,
            description
          )
        `)
                .eq('user_id', user.id)

            if (error) {
                console.error('Supabase error:', error)
                toast.error(`Failed to load organizations: ${error.message}`)
                setOrganizations([])
                setIsLoading(false)
                return
            }

            console.log('Raw data from Supabase:', data)

            const orgs = data?.map(item => item.organizations).filter(Boolean) as Organization[]
            console.log('Processed organizations:', orgs)
            setOrganizations(orgs || [])
        } catch (error: any) {
            console.error('Unexpected error loading organizations:', error)
            toast.error('An unexpected error occurred while loading organizations')
            setOrganizations([])
        } finally {
            setIsLoading(false)
        }
    }

    const createOrganization = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsCreating(true)

        try {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) throw new Error('Not authenticated')

            // Create slug from name
            const slug = newOrgName.toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/^-|-$/g, '')

            // Create organization
            const { data: org, error: orgError } = await supabase
                .from('organizations')
                .insert({
                    name: newOrgName,
                    slug,
                    description: newOrgDescription || null
                })
                .select()
                .single()

            if (orgError) throw orgError

            // Add user as owner
            const { error: memberError } = await supabase
                .from('organization_members')
                .insert({
                    organization_id: org.id,
                    user_id: user.id,
                    role: 'owner'
                })

            if (memberError) throw memberError

            toast.success('Organization created successfully!')
            setIsDialogOpen(false)
            setNewOrgName('')
            setNewOrgDescription('')
            loadOrganizations()
            selectOrganization(org.id)
        } catch (error: any) {
            console.error('Error creating organization:', error)
            toast.error(error.message || 'Failed to create organization')
        } finally {
            setIsCreating(false)
        }
    }

    const selectOrganization = (orgId: string) => {
        // Store selected organization in localStorage
        localStorage.setItem('selectedOrganization', orgId)
        router.push('/dashboard')
    }

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-secondary/30 p-4">
            <Card className="w-full max-w-2xl shadow-medium border-0">
                <CardHeader className="text-center space-y-2">
                    <div className="flex justify-center mb-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl gradient-eco">
                            <Building2 className="h-6 w-6 text-white" />
                        </div>
                    </div>
                    <CardTitle className="text-2xl font-bold">Select Organization</CardTitle>
                    <CardDescription>
                        Choose an organization or create a new one to get started
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {organizations.length > 0 ? (
                        <div className="grid gap-3">
                            {organizations.map((org) => (
                                <button
                                    key={org.id}
                                    onClick={() => selectOrganization(org.id)}
                                    className="p-4 rounded-lg border bg-card hover:bg-accent hover:text-accent-foreground transition-colors text-left group"
                                >
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <h3 className="font-semibold group-hover:text-primary transition-colors">
                                                {org.name}
                                            </h3>
                                            {org.description && (
                                                <p className="text-sm text-muted-foreground mt-1">
                                                    {org.description}
                                                </p>
                                            )}
                                        </div>
                                        <Building2 className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                                    </div>
                                </button>
                            ))}
                        </div>
                    ) : (
                        <p className="text-center text-muted-foreground py-8">
                            No organizations found. Create your first one to get started!
                        </p>
                    )}

                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger asChild>
                            <Button className="w-full gradient-eco text-white border-0 mt-4" size="lg">
                                <Plus className="h-4 w-4 mr-2" />
                                Create New Organization
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <form onSubmit={createOrganization}>
                                <DialogHeader>
                                    <DialogTitle>Create Organization</DialogTitle>
                                    <DialogDescription>
                                        Set up a new organization to manage environmental compliance
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4 py-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="org-name">Organization Name</Label>
                                        <Input
                                            id="org-name"
                                            placeholder="e.g., Acme Environmental Corp"
                                            value={newOrgName}
                                            onChange={(e) => setNewOrgName(e.target.value)}
                                            required
                                            disabled={isCreating}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="org-description">Description (Optional)</Label>
                                        <Input
                                            id="org-description"
                                            placeholder="Brief description of your organization"
                                            value={newOrgDescription}
                                            onChange={(e) => setNewOrgDescription(e.target.value)}
                                            disabled={isCreating}
                                        />
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => setIsDialogOpen(false)}
                                        disabled={isCreating}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        type="submit"
                                        className="gradient-eco text-white border-0"
                                        disabled={isCreating}
                                    >
                                        {isCreating ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                Creating...
                                            </>
                                        ) : (
                                            'Create Organization'
                                        )}
                                    </Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
                </CardContent>
            </Card>
        </div>
    )
}
