## Push Frontend

#### Wichtige Dateien

##### index.controller.ts
```typescript
const webpush = require('web-push');

{ ... }

public send(subscription, data = null) {
  // Set encryption details (public key is used in frontend)
  webpush.setVapidDetails(
    'http://localhost:3000/',
    this.vapidKeys.publicKey,
    this.vapidKeys.privateKey
  );

  // Actually send notification or delete it if subscription got revoked by user
  webpush.sendNotification(subscription, JSON.stringify(data)).catch((err) => {
    if (err.statusCode === 404 || err.statusCode === 410) {
      LoggerService.Info('Subscription expired, deleting');
      this.subscriptionService.delete(subscription).subscribe();
    }
  });
}
```
