import { useEffect, useMemo, useRef, useState } from 'react'
import type { Socket } from 'socket.io-client'
import { ProfileCard } from './components/ProfileCard'
import { Avatar } from './components/Avatar'
import { ChatSession } from './components/ChatSession'
import { DmSession } from './components/DmSession'
import { FriendsPanel } from './components/FriendsPanel'
import { NewChat } from './components/NewChat'
import { SettingsModal } from './components/SettingsModal'
import { Sidebar } from './components/Sidebar'
import { useChitchat } from './hooks/useChitchat'
import { useProfile } from './hooks/useProfile'
import { useToast } from './hooks/useToast'
import { loadOrCreateUserId } from './lib/storage'
import './App.css'
import './profile.css'

export default function App() {
  const socketRef = useRef<Socket | null>(null)
  const userId = useMemo(loadOrCreateUserId, [])
  const { toast, showToast } = useToast()

  const profile = useProfile(socketRef, showToast)
  const chat = useChitchat({
    socketRef,
    userId,
    profileRef: profile.profileRef,
    applyServerProfile: profile.applyServerProfile,
    showToast,
  })

  const [filterGender, setFilterGender] = useState('any')
  const [filterCountry, setFilterCountry] = useState('')
  const [profileCardOpen, setProfileCardOpen] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return
      setProfileCardOpen(false)
      setSettingsOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const openProfile = () => {
    setProfileCardOpen(true)
    setSettingsOpen(false)
  }
  const openSettings = () => {
    setSettingsOpen(true)
    setProfileCardOpen(false)
  }

  const inSession = chat.phase === 'searching' || chat.phase === 'chatting'
  const activeFriend =
    chat.friends.find((f) => f.publicId === chat.activeDmId) ?? null

  const renderMain = () => {
    if (chat.activeDmId && activeFriend) {
      return (
        <DmSession
          key={activeFriend.publicId}
          friend={{ ...activeFriend, online: chat.onlineFriends.has(activeFriend.publicId) }}
          chatId={chat.dmChatId}
          messages={chat.dmMessages}
          userId={userId}
          displayName={profile.displayName}
          avatarHue={profile.avatarHue}
          isTyping={chat.dmTyping === activeFriend.publicId}
          onSend={chat.sendDm}
          onTyping={() => chat.sendDmTyping()}
          onMarkRead={chat.markDmRead}
          onReact={chat.reactToMessage}
          onUnfriend={() => chat.removeFriend(activeFriend.publicId)}
          onBlock={() => chat.blockUser(activeFriend.publicId)}
          onReport={() => chat.reportUser(activeFriend.publicId)}
        />
      )
    }
    if (inSession) {
      return (
        <ChatSession
          phase={chat.phase}
          partnerLabel={chat.partnerLabel}
          partnerPublicId={chat.partnerPublicId}
          partnerTyping={chat.partnerTyping}
          friendRequestSent={chat.friendRequestSent}
          messages={chat.messages}
          onSend={chat.sendMessage}
          onTyping={chat.sendTyping}
          onNext={chat.nextChat}
          onCancel={chat.cancelSearch}
          onSendFriendRequest={chat.sendFriendRequest}
          onBlock={() => chat.partnerPublicId && chat.blockUser(chat.partnerPublicId)}
          onReport={() => chat.partnerPublicId && chat.reportUser(chat.partnerPublicId)}
        />
      )
    }
    if (chat.nav === 'friends') {
      return (
        <FriendsPanel
          friends={chat.friends.map((f) => ({ ...f, online: chat.onlineFriends.has(f.publicId) }))}
          pendingRequests={chat.pendingRequests}
          onOpen={chat.openDm}
          onRemove={chat.removeFriend}
          onAccept={chat.acceptFriendRequest}
          onDecline={chat.declineFriendRequest}
        />
      )
    }
    return (
      <NewChat
        interests={profile.interests}
        interestsOn={profile.interestsOn}
        gender={profile.gender}
        filterGender={filterGender}
        filterCountry={filterCountry}
        busy={inSession}
        canStart={chat.phase !== 'disconnected' && chat.phase !== 'registering'}
        onToggleInterest={profile.toggleInterest}
        onToggleInterestsOn={profile.toggleInterestsOn}
        onGenderChange={profile.changeGender}
        onFilterGender={setFilterGender}
        onFilterCountry={setFilterCountry}
        onStart={() =>
          chat.startChat({ gender: filterGender, country: filterCountry })
        }
      />
    )
  }

  return (
    <div className="shell">
      <Sidebar
        phase={chat.phase}
        nav={chat.nav}
        activeDmId={chat.activeDmId}
        showNewChat={chat.nav === 'chat' && !inSession && !chat.activeDmId}
        friends={chat.friends}
        displayName={profile.displayName}
        avatarHue={profile.avatarHue}
        onChat={chat.goNewChat}
        onFriends={chat.openFriendsTab}
        onOpenDm={chat.openDm}
        onRemoveFriend={chat.removeFriend}
        onOpenProfile={openProfile}
        onOpenSettings={openSettings}
      />

      <main className="main">
        {chat.connectionError && (
          <div className="banner error">{chat.connectionError}</div>
        )}
        {toast && <div className="banner toast">{toast}</div>}
        {renderMain()}
      </main>

      <ProfileCard
        open={profileCardOpen}
        profile={{
          publicId: userId,
          displayName: profile.displayName,
          gender: profile.gender,
          country: profile.country,
          interests: profile.interests,
          interestsOn: profile.interestsOn,
          avatarHue: profile.avatarHue,
          bannerStyle: profile.bannerStyle,
          joinDate: profile.joinDate,
        }}
        avatar={
          <Avatar
            name={profile.displayName || 'Guest'}
            hue={profile.avatarHue}
            size={92}
          />
        }
        onClose={() => setProfileCardOpen(false)}
        onEditProfile={openSettings}
      />

      {settingsOpen && (
        <SettingsModal
          displayName={profile.displayName}
          avatarHue={profile.avatarHue}
          bannerStyle={profile.bannerStyle}
          interests={profile.interests}
          interestsOn={profile.interestsOn}
          nameChangesLeft={profile.nameChangesLeft}
          onClose={() => setSettingsOpen(false)}
          onCycleAvatar={profile.cycleAvatar}
          onResetAvatar={profile.resetAvatar}
          onBanner={profile.changeBanner}
          onToggleInterest={profile.toggleInterest}
          onCommitName={profile.commitUsername}
        />
      )}
    </div>
  )
}
