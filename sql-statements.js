////////////////////////////////////////////////////////////////////////////////
/// Abstract device model
////////////////////////////////////////////////////////////////////////////////

/// SELECTS

const getParams = `
  SELECT *
  FROM C_PARAMS
`;

const getParam = `
  SELECT *
  FROM C_PARAMS
  WHERE param_id = @paramId
`;

const getProtocols = `
  SELECT *
  FROM C_PROTOCOLS
`;

const getProtocol = `
  SELECT *
  FROM C_PROTOCOLS
  WHERE protocol_id = @protocolId
`;

const getDeviceTypes = `
  SELECT *
  FROM C_DEV_TYPES
`;

const getDeviceType = `
  SELECT *
  FROM C_DEV_TYPES
  WHERE type_id = @typeId
`;

const getTypeParams = `
  SELECT *
  FROM C_TYPE_PARAMS
  WHERE fk_type_id = @typeId
`;

const getDevices = `
  SELECT *
  FROM T_DEVICES
`;

const getDevice = `
  SELECT *
  FROM T_DEVICES
  WHERE dev_id = @devId
`;

const getAllDeviceParams = `
  SELECT *
  FROM T_DEV_PARAMS
`;

const getDeviceParams = `
  SELECT *
  FROM T_DEV_PARAMS
  WHERE fk_dev_id = @devId
`;

const getDeviceParam = `
  SELECT *
  FROM T_DEV_PARAMS
  WHERE dev_param_id = @paramId
`;


/// INSERTS

const addParam = `
  INSERT INTO
  C_PARAMS (name)
  VALUES (
    @name
  )
`;

const addDeviceType = `
  INSERT INTO
  C_DEV_TYPES (type, supplier, model, details)
  VALUES (
    @type,
    @supplier,
    @model,
    @details
  )
`;

const addTypeParam = `
  INSERT INTO
  C_TYPE_PARAMS (fk_type_id, fk_param_id, fk_protocol_id, name, units, def_val, rrd_enable, details)
  VALUES (
    @typeId,
    @paramId,
    @protocolId,
    @name,
    @units,
    @def_val,
    @rrd_enable,
    @details
  )
`;

const addDevice = `
  INSERT INTO
  T_DEVICES (fk_type_id, name, details)
  VALUES (
    @typeId,
    @name,
    @details
  )
`;

const addDeviceParam = `
  INSERT INTO
  T_DEV_PARAMS (fk_dev_id, fk_param_id, fk_protocol_id, name, units, value, rrd_enable, polled, details)
  VALUES (
    @devId,
    @paramId,
    @protocolId,
    @name,
    @units,
    @value,
    @rrd_enable,
    @polled,
    @details
  )
`;

/// UPDATES

const updateDeviceParam = `
  UPDATE
  T_DEV_PARAMS
  SET
    value = coalesce(@value, value),
    polled = coalesce(@polled, polled),
    timestamp = (strftime('%s', 'now'))
  WHERE
    dev_param_id = @paramId
`;

/// DELETES

const removeDevice = `
  DELETE
  FROM T_DEVICES
  WHERE dev_id = @devId
`;

////////////////////////////////////////////////////////////////////////////////
/// ZWAVE
////////////////////////////////////////////////////////////////////////////////

const addZwaveDevice = `
  INSERT OR IGNORE
  INTO ZWAVE_DEVICES (module_id, node_id)
  VALUES (@moduleId, @nodeId)
`;

const removeZwaveDevice = `
  DELETE
  FROM ZWAVE_DEVICES
  WHERE module_id = @moduleId AND node_id = @nodeId
`;

const addZwaveNodeInformation = `
  UPDATE ZWAVE_DEVICES
  SET manufacturer = @manufacturer, product = @product, type = @type
  WHERE module_id = @moduleId AND node_id = @nodeId
`;

const getZwaveDevices = `
  SELECT *
  FROM ZWAVE_DEVICES
  WHERE module_id = @moduleId
`;

const getZwaveDevice = `
  SELECT *
  FROM ZWAVE_DEVICES
  WHERE module_id = @moduleId AND node_id = @nodeId
`;

const addZwaveDevParam = `
  INSERT OR IGNORE INTO
  ZWAVE_DEV_PARAMS (module_id, node_id, value_id, name, value, units, help, writable, possible_values)
  VALUES (
    @moduleId,
    @nodeId,
    @valueId,
    @name,
    @value,
    @units,
    @help,
    @writable,
    @possibleValues
  )
`;

const updateZwaveDevParam = `
  UPDATE ZWAVE_DEV_PARAMS
  SET
    fk_param_id = coalesce(@paramId, fk_param_id),
    value = coalesce(@value, value),
    polled = coalesce(@polled, polled),
    poll_intensity = coalesce(@pollIntensity, poll_intensity)
  WHERE
    module_id = @moduleId AND value_id = @valueId
`;

const updateZwaveBasicSet = `
  INSERT INTO
  ZWAVE_DEV_PARAMS (module_id, node_id, value_id, name, value, info, writable)
  VALUES (
          @moduleId,
          @nodeId,
          @valueId,
          'BASIC SET',
          @value,
          'BASIC SET data received from device',
          0
   ) ON CONFLICT (module_id, value_id) DO UPDATE
   SET
   value = @value
`;

////////////////////////////////////////////////////////////////////////////////
/// Use case specific operations
////////////////////////////////////////////////////////////////////////////////

const getZwaveDeviceParams = `
  SELECT *
  FROM ZWAVE_DEV_PARAMS
  WHERE module_id = @moduleId AND node_id = @nodeId
`;

const getZwaveParamByDevParam = `
  SELECT
    value_id as valueId,
    writable as writable,
    module_id as moduleId,
    node_id as nodeId
  FROM ZWAVE_DEV_PARAMS
  WHERE fk_param_id = @paramId
`;

const getDevParamByZwaveParam = `
  SELECT
    fk_param_id
  FROM ZWAVE_DEV_PARAMS
  WHERE module_id = @moduleId AND value_id = @valueId
`;

////////////////////////////////////////////////////////////////////////////////
/// Exports
////////////////////////////////////////////////////////////////////////////////

module.exports = {
  getParams,
  getParam,
  getProtocols,
  getProtocol,
  getDeviceTypes,
  getDeviceType,
  getTypeParams,
  getDevices,
  getDevice,
  getAllDeviceParams,
  getDeviceParams,
  getDeviceParam,

  addParam,
  addDeviceType,
  addTypeParam,
  addDevice,
  addDeviceParam,

  updateDeviceParam,

  removeDevice,

  getZwaveParamByDevParam,
  getDevParamByZwaveParam,

  getZwaveDevices,
  getZwaveDevice,
  getZwaveDeviceParams,
  addZwaveDevice,
  removeZwaveDevice,
  addZwaveNodeInformation,
  addZwaveDevParam,
  updateZwaveBasicSet,
  updateZwaveDevParam,
};
