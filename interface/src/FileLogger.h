//
//  FileLogger.h
//  interface/src
//
//  Created by Stojce Slavkovski on 12/22/13.
//  Copyright 2013 High Fidelity, Inc.
//
//  Distributed under the Apache License, Version 2.0.
//  See the accompanying file LICENSE or http://www.apache.org/licenses/LICENSE-2.0.html
//

#ifndef hifi_FileLogger_h
#define hifi_FileLogger_h

#include "AbstractLoggerInterface.h"
#include <GenericQueueThread.h>

class FileLogger : public AbstractLoggerInterface {
    Q_OBJECT

public:
    FileLogger(QObject* parent = NULL);
    virtual ~FileLogger();

    virtual void addMessage(const QString&);
    virtual QString getLogData() { return _logData; }
    virtual void locateLog();

private:
    QString _logData;
    QString _fileName;
    friend class FilePersistThread;
};



#endif // hifi_FileLogger_h
