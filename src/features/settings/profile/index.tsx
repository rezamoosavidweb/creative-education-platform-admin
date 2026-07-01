import { MyProfileCard } from '@/features/profiles/components/my-profile-card'
import { ContentSection } from '../components/content-section'

export function SettingsProfile() {
  return (
    <ContentSection
      title='Profile'
      desc='This is how others will see you on the site.'
    >
      <MyProfileCard />
    </ContentSection>
  )
}
