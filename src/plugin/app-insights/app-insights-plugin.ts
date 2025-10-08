import type { Utilisateur } from '@/features/auth';
import { useAuthentificationStore } from '@/features/auth/authentification/stores/useAuthentificationStore';
import { SilentError } from '@/features/shared/types';
import { ApplicationInsights, SeverityLevel } from '@microsoft/applicationinsights-web';
import type { App } from 'vue';
import type { Router } from 'vue-router';

const appInsights = new ApplicationInsights({
  config: {
    connectionString: import.meta.env.VITE_INSIGHT_CONNEXION
    // Attention, il peut y avoir des erreur cors avec des bloquer de pub,
    // comme uBlock origin, ...
  }
});

appInsights.loadAppInsights();
appInsights.trackPageView();

function setupPageTracking(router: Router) {
  router.beforeEach((route, _from, next) => {
    setUser()
    const name = route.name?.toString()
    appInsights.context.telemetryTrace.traceID = appInsights.core.getTraceCtx()?.getTraceId()
    appInsights.context.telemetryTrace.name = name
    appInsights.startTrackPage(name)
    next()
  })

  router.afterEach(route => {
    const name = route.name?.toString()
    const url = location.protocol + '//' + location.host + route.fullPath;
    appInsights.stopTrackPage(name, url)
    appInsights.flush()
  })
}

function setUser() {
  const auth = useAuthentificationStore()
  if (auth.utilisateur) {
    const authenticatedId = auth.utilisateur.userId
    const accountId = auth.utilisateur.estInterne ? (auth.utilisateur as Utilisateur).impresonnaliseEmail : auth.utilisateur.email

    if (appInsights.context.user.accountId === accountId && appInsights.context.user.authenticatedId === authenticatedId) return
    appInsights.setAuthenticatedUserContext(
      authenticatedId,
      accountId
    )
  } else {
    if (!appInsights.context.user.authenticatedId) return
    appInsights.clearAuthenticatedUserContext()
  }
}

type Options = {
  router: Router
}

export type RemoteLogger = {
  log: (...args: any[]) => void
  error: (error: Error | string | undefined, ...args: any[]) => void
}

export default {
  install(app: App<Element>, options: Options) {
    // Configure les handler VueJS
    app.config.errorHandler = (error) => {
      if (error instanceof SilentError) return
      setUser()
      appInsights.trackException({ exception: error as Error })
      console.error(error)
    }
    app.config.warnHandler = (warning) => {
      setUser()
      appInsights.trackTrace({
        message: warning,
        severityLevel: SeverityLevel.Warning,
      })
      console.warn(warning)
    }

    // Configure la navigation
    const { router } = options
    if (router) {
      setupPageTracking(router);
    }

    // Configure les helpers
    app.config.globalProperties.$remoteLogger = {
      log: (...args: any[]) => {
        setUser()
        const message = typeof args[0] === "string" ? args[0] : typeof args[0] === 'object' ? JSON.stringify(args[0]) : `${args[0] ?? 'empty'}`
        appInsights.trackTrace({
          message: message,
          severityLevel: SeverityLevel.Information,
          properties: {
            arguments: args
          }
        })
        console.log(...args)
      },
      error: (error: Error | string | undefined, ...args: any[]) => {
        if (error instanceof SilentError) return
        setUser()
        appInsights.trackException({
          exception: error as Error,
          properties: {
            arguments: args
          }
        })
        console.error(...[error, ...args])
      }
    } as RemoteLogger

    app.provide<RemoteLogger>('$remoteLogger', app.config.globalProperties.$remoteLogger)
  }
}

declare module 'vue' {
  interface ComponentCustomProperties {
    $remoteLogger: RemoteLogger
  }
}


