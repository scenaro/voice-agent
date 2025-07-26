type Props = {
  children: React.ReactNode
}

export default function AgentAudioTrackBtn({children} : Props) {
  return <div className="sc-agent-audio-track-btn">
    {children}
  </div>
}