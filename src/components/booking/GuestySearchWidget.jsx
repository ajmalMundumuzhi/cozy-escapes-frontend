
import { useEffect, useRef } from 'react'

const WIDGET_ID = 'search-widget_IO312PWQ'
const SCRIPT_URL =
  'https://s3.amazonaws.com/guesty-frontend-production/search-bar-production.js'
const CSS_URL =
  'https://s3.amazonaws.com/guesty-frontend-production/search-bar-production.css'

const CONFIG = {
  siteUrl: 'avantaliving.guestybookings.com',
  color: '#206CFF',
}

let widgetPromise

function loadGuestyWidget() {
  if (window.GuestySearchBarWidget) {
    return Promise.resolve(window.GuestySearchBarWidget)
  }

  if (!widgetPromise) {
    widgetPromise = new Promise((resolve, reject) => {
      if (!document.querySelector(`link[href="${CSS_URL}"]`)) {
        const link = document.createElement('link')
        link.rel = 'stylesheet'
        link.type = 'text/css'
        link.href = CSS_URL
        document.head.appendChild(link)
      }

      const script = document.createElement('script')
      script.src = SCRIPT_URL
      script.async = true

      script.onload = () => {
        if (window.GuestySearchBarWidget) {
          resolve(window.GuestySearchBarWidget)
        } else {
          reject(new Error('Guesty widget failed to initialize.'))
        }
      }

      script.onerror = () => {
        widgetPromise = null
        reject(new Error('Unable to load Guesty search widget.'))
      }

      document.body.appendChild(script)
    })
  }

  return widgetPromise
}

export default function GuestySearchWidget() {
  const initialized = useRef(false)

  useEffect(() => {
    let cancelled = false

    if (initialized.current) return

    initialized.current = true

    loadGuestyWidget()
      .then((widget) => {
        if (!cancelled) {
          return widget.create(CONFIG)
        }
      })
      .catch((error) => {
        console.error('[Guesty Widget]:', error.message)
      })

    return () => {
      cancelled = true
    }
  }, [])

  return (
    <div
      id={WIDGET_ID}
      className="w-full"
    />
  )
}
