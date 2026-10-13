import { useEffect, useState } from 'react'

type Props = {
  onAccept: () => void
}

export function AgeGateModal(p: Props) {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const seen = localStorage.getItem('cc_age_gate_seen')
    if (!seen) setShow(true)
  }, [])

  const handleAccept = () => {
    localStorage.setItem('cc_age_gate_seen', 'true')
    setShow(false)
    p.onAccept()
  }

  if (!show) return null

  return (
    <div className="modal-backdrop">
      <section className="age-gate-modal" role="dialog" aria-labelledby="age-gate-title">
        <h2 id="age-gate-title">Age Verification & Disclaimer</h2>
        <div className="age-gate-content">
          <p>
            <strong>You must be 18 years or older to use this service.</strong>
          </p>
          <p>
            By continuing, you agree to our Terms of Service and acknowledge that:
          </p>
          <ul>
            <li>You are at least 18 years old</li>
            <li>You will treat all users with respect</li>
            <li>You will not engage in harassment, abuse, or illegal activity</li>
            <li>Conversations may be monitored for safety and compliance</li>
            <li>You accept the risks of chatting with strangers online</li>
          </ul>
          <p className="muted tiny">
            This is a random chat platform. Please use responsibly and report any inappropriate behavior.
          </p>
        </div>
        <div className="age-gate-actions">
          <button type="button" className="primary-btn" onClick={handleAccept}>
            I Agree & Continue
          </button>
        </div>
      </section>
    </div>
  )
}
