import { useEffect, useState } from 'react'

export default function Terms() {
  const [content, setContent] = useState('')

  useEffect(() => {
    let isMounted = true
    fetch('/terms-content.html')
      .then((res) => res.text())
      .then((html) => {
        if (isMounted) setContent(html)
      })
      .catch(() => {
        if (isMounted) setContent('<p>Unable to load terms at this time.</p>')
      })

    return () => {
      isMounted = false
    }
  }, [])

  return (
    <section id="last">
      <div className="full">
        <section className="page-section" style={{ backgroundColor: '#fff', marginTop: '75px' }}>
          <div className="container">
            <div className="row">
              <div className="col-sm-12">
                <div dangerouslySetInnerHTML={{ __html: content }} />
              </div>
            </div>
          </div>
        </section>
      </div>
    </section>
  )
}
