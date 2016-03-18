(function() {

    var SEARCH_RADIUS = 100;

    var EMISSIVE_TEXTURE_URL = "http://hifi-content.s3.amazonaws.com/highfidelitysign_white_emissive.png";

    var DIFFUSE_TEXTURE_URL = "http://hifi-content.s3.amazonaws.com/highfidelity_diffusebaked.png";

    var _this;
    var utilitiesScript = Script.resolvePath('../utils.js');
    Script.include(utilitiesScript);
    Switch = function() {
        _this = this;
        this.switchSound = SoundCache.getSound("https://hifi-public.s3.amazonaws.com/sounds/Switches%20and%20sliders/lamp_switch_2.wav");
    };

    Switch.prototype = {
        prefix: 'hifi-home-dressing-room-disc-',
        clickReleaseOnEntity: function(entityID, mouseEvent) {
            if (!mouseEvent.isLeftButton) {
                return;
            }
            this.toggleLights();
        },

        startNearTrigger: function() {
            this.toggleLights();
        },

        modelEmitOn: function(glowDisc) {
            print("EBL TURN ON EMIT TEXTURE");
            Entities.editEntity(glowDisc, {
                textures: 'emissive:' + EMISSIVE_TEXTURE_URL + ',\ndiffuse:"' + DIFFUSE_TEXTURE_URL + '"'
            });
        },

        modelEmitOff: function(glowDisc) {
            print("EBL TURN OFF EMIT TEXTURE");
            Entities.editEntity(glowDisc, {
                textures: 'emissive:"",\ndiffuse:"' + DIFFUSE_TEXTURE_URL + '"'
            })
        },

        masterLightOn: function(masterLight) {
            Entities.editEntity(masterLight, {
                visible: true
            });
        },

        masterLightOff: function(masterLight) {
            Entities.editEntity(masterLight, {
                visible: false
            });
        },

        glowLightOn: function(glowLight) {
            Entities.editEntity(glowLight, {
                visible: true
            });
        },

        glowLightOff: function(glowLight) {
            Entities.editEntity(glowLight, {
                visible: false
            });
        },

        findGlowLights: function() {
            var found = [];
            var results = Entities.findEntities(this.position, SEARCH_RADIUS);
            results.forEach(function(result) {
                var properties = Entities.getEntityProperties(result);
                if (properties.name === _this.prefix + "light-glow") {
                    found.push(result);
                }
            });
            return found;
        },

        findMasterLights: function() {
            var found = [];
            var results = Entities.findEntities(this.position, SEARCH_RADIUS);
            results.forEach(function(result) {
                var properties = Entities.getEntityProperties(result);
                if (properties.name === _this.prefix + "light-master") {
                    found.push(result);
                }
            });
            return found;
        },

        findEmitModels: function() {
            var found = [];
            var results = Entities.findEntities(this.position, SEARCH_RADIUS);
            results.forEach(function(result) {
                var properties = Entities.getEntityProperties(result);
                if (properties.name === _this.prefix + "light-model") {
                    found.push(result);
                }
            });
            // Only one light for now
            return found;
        },

        toggleLights: function() {

            _this._switch = getEntityCustomData('home-switch', _this.entityID, {state: 'off'});

            var glowLights = this.findGlowLights();
            var masterLights = this.findMasterLights();
            var emitModels = this.findEmitModels();

            if (this._switch.state === 'off') {
                glowLights.forEach(function(glowLight) {
                    _this.glowLightOn(glowLight);
                });
                masterLights.forEach(function(masterLight) {
                    _this.masterLightOn(masterLight);
                });
                emitModels.forEach(function(emitModel) {
                    _this.modelEmitOn(emitModel);
                });
                setEntityCustomData('home-switch', _this.entityID, {
                    state: 'on'
                });

            } else {
                glowLights.forEach(function(glowLight) {
                    _this.glowLightOff(glowLight);
                });
                masterLights.forEach(function(masterLight) {
                    _this.masterLightOff(masterLight);
                });
                emitModels.forEach(function(emitModel) {
                    _this.modelEmitOff(emitModel);
                });
                setEntityCustomData('home-switch', this.entityID, {
                    state: 'off'
                });
            }

            this.flipSwitch();
            Audio.playSound(this.switchSound, {
                volume: 0.5,
                position: this.position
            });

        },

        flipSwitch: function() {
            var rotation = Entities.getEntityProperties(this.entityID, "rotation").rotation;
            var axis = {
                x: 0,
                y: 1,
                z: 0
            };
            var dQ = Quat.angleAxis(180, axis);
            rotation = Quat.multiply(rotation, dQ);

            Entities.editEntity(this.entityID, {
                rotation: rotation
            });
        },

        preload: function(entityID) {
            this.entityID = entityID;
            setEntityCustomData('grabbableKey', this.entityID, {
                wantsTrigger: true
            });

            var properties = Entities.getEntityProperties(this.entityID);


            //The light switch is static, so just cache its position once
            this.position = Entities.getEntityProperties(this.entityID, "position").position;
        }
    };

    // entity scripts always need to return a newly constructed object of our type
    return new Switch();
});