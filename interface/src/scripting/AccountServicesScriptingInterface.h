//
//  AccountServicesScriptingInterface.h
//  interface/src/scripting
//
//  Created by Thijs Wenker on 9/10/14.
//  Copyright 2014 High Fidelity, Inc.
//
//  Distributed under the Apache License, Version 2.0.
//  See the accompanying file LICENSE or http://www.apache.org/licenses/LICENSE-2.0.html
//

#ifndef hifi_AccountServicesScriptingInterface_h
#define hifi_AccountServicesScriptingInterface_h

#include <QObject>
#include <QScriptContext>
#include <QScriptEngine>
#include <QScriptValue>
#include <QString>
#include <QStringList>
#include <DiscoverabilityManager.h>

class DownloadInfoResult {
public:
    DownloadInfoResult();
    QList<float> downloading;  // List of percentages
    float pending;
};

Q_DECLARE_METATYPE(DownloadInfoResult)

QScriptValue DownloadInfoResultToScriptValue(QScriptEngine* engine, const DownloadInfoResult& result);
void DownloadInfoResultFromScriptValue(const QScriptValue& object, DownloadInfoResult& result);

class AccountServicesScriptingInterface : public QObject {
    Q_OBJECT
    
    Q_PROPERTY(QString username READ getUsername NOTIFY myUsernameChanged)
    Q_PROPERTY(bool loggedIn READ loggedIn NOTIFY loggedInChanged)
    Q_PROPERTY(QString findableBy READ getFindableBy WRITE setFindableBy NOTIFY findableByChanged)
    Q_PROPERTY(QUrl metaverseServerURL READ getMetaverseServerURL)
    
public:
    static AccountServicesScriptingInterface* getInstance();

    const QString getUsername() const;
    bool loggedIn() const { return _loggedIn; }
    QUrl getMetaverseServerURL() { return DependencyManager::get<AccountManager>()->getMetaverseServerURL(); }
    
public slots:
    DownloadInfoResult getDownloadInfo();
    void updateDownloadInfo();

    bool isLoggedIn();
    bool checkAndSignalForAccessToken();
    void logOut();
    
private slots:
    void loggedOut();
    void checkDownloadInfo();
    
    QString getFindableBy() const;
    void setFindableBy(const QString& discoverabilityMode);
    void discoverabilityModeChanged(Discoverability::Mode discoverabilityMode);

    void onUsernameChanged(const QString& username);

signals:
    void connected();
    void disconnected(const QString& reason);
    void myUsernameChanged(const QString& username);
    void downloadInfoChanged(DownloadInfoResult info);
    void findableByChanged(const QString& discoverabilityMode);
    void loggedInChanged(bool loggedIn);

private:
    AccountServicesScriptingInterface();
    ~AccountServicesScriptingInterface();
    
    bool _downloading;
    bool _loggedIn{ false };
};

#endif // hifi_AccountServicesScriptingInterface_h
