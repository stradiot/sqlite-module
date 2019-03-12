const Database = require('better-sqlite3')
const { pick, pickAll, omit, isNil, unless, toString } = require('ramda');
const sql = require('./sql-statements');
const { database: path } = require('./config');

const db = new Database(path, { fileMustExist: true });

////////////////////////////////////////////////////////////////////////////////
/// Abstract device model
////////////////////////////////////////////////////////////////////////////////

/// SELECTS

const getParams = () => {
  const prepared = db.prepare(sql.getParams);

  return prepared.all();
};

const getParam = (input = {}) => {
  const config = pick(['paramId'], input);
  const prepared = db.prepare(sql.getParam);

  return prepared.get(config);
};

const getDatatypes = () => {
  const prepared = db.prepare(sql.getDatatypes);

  return prepared.all();
};

const getDatatype = (input = {}) => {
  const config = pick(['datatypeId'], input);
  const prepared = db.prepare(sql.getDatatype);

  return prepared.get(config);
};

const getProtocols = () => {
  const prepared = db.prepare(sql.getProtocols);

  return prepared.all();
};

const getProtocol = (input = {}) => {
  const config = pick(['protocolId'], input);
  const prepared = db.prepare(sql.getProtocol);

  return prepared.get(config);
};

const getDeviceTypes = () => {
  const prepared = db.prepare(sql.getDeviceTypes);

  return prepared.all();
};

const getDeviceType = (input = {}) => {
  const config = pick(['typeId'], input);
  const prepared = db.prepare(sql.getDeviceType);

  return prepared.get(config);
};

const getTypeParams = (input = {}) => {
  const config = pick(['typeId'], input);
  const prepared = db.prepare(sql.getTypeParams);

  return prepared.all(config);
};

const getDevices = () => {
  const prepared = db.prepare(sql.getDevices);

  return prepared.all();
};

const getDevice = (input = {}) => {
  const config = pick(['devId'], input);
  const prepared = db.prepare(sql.getDevice);

  return prepared.get(config);
};

const getAllDeviceParams = () => {
  const prepared = db.prepare(sql.getAllDeviceParams);

  return prepared.all();
};

const getDeviceParams = (input = {}) => {
  const config = pick(['devId'], input);
  const prepared = db.prepare(sql.getDeviceParams);

  return prepared.all(config);
};

const getDeviceParam = (input = {}) => {
  const config = pick(['paramId'], input);
  const prepared = db.prepare(sql.getDeviceParam);

  return prepared.get(config);
};

/// INSERTS

const addParam = (input = {}) => {
  const config = pick(['name'], input);
  const prepared = db.prepare(sql.addParam);

  const { changes, lastInsertRowid: id } = prepared.run(config);

  return !!changes && id;
};

const addDeviceType = (input = {}) => {
  const config = pickAll(['type', 'supplier', 'model', 'details'], input);
  const prepared = db.prepare(sql.addDeviceType);

  const { changes, lastInsertRowid: id } = prepared.run(config);

  return !!changes && id;
};

const addTypeParam = (input = {}) => {
  const config = pickAll(
    [
      'typeId',
      'paramId',
      'protocolId',
      'datatypeId',
      'name',
      'units',
      'def_val',
      'rrd_enable',
      'details'
    ], input
  );
  config.def_val = `${config.def_val}`;
  config.rrd_enable |= 0;
  const prepared = db.prepare(sql.addTypeParam);

  const { changes } = prepared.run(config);

  return !!changes;
};

const addDevice = (input = {}) => {
  const config = pickAll(['typeId', 'name', 'details'], input);
  const prepared = db.prepare(sql.addDevice);

  const { changes, lastInsertRowid: id } = prepared.run(config);

  return !!changes && id;
};

const addDeviceParam = (input = {}) => {
  const config = pickAll([
      'devId',
      'paramId',
      'protocolId',
      'datatypeId',
      'name',
      'units',
      'value',
      'rrd_enable',
      'polled',
      'details'
    ], input
  );
  config.value = `${config.value}`;
  config.rrd_enable |= 0;
  config.polled |= 0;

  const prepared = db.prepare(sql.addDeviceParam);

  const { changes, lastInsertRowid: id } = prepared.run(config);

  return !!changes && id;
};

/// UPDATES

const updateDeviceParam = (input = {}) => {
  const config = pickAll([
      'paramId',
      'value',
      'polled'
    ], input
  );
  config.value = `${config.value}`;
  config.polled |= 0;
  const prepared = db.prepare(sql.updateDeviceParam);

  const { changes } = prepared.run(config);

  return !!changes;
};

/// DELETES

const removeDevice = (input = {}) => {
  const config = pick(['devId'], input);
  const prepared = db.prepare(sql.removeDevice);

  const { changes } = prepared.run(config);

  return !!changes;
};

////////////////////////////////////////////////////////////////////////////////
/// ZWAVE_DEVICES
////////////////////////////////////////////////////////////////////////////////

const getZwaveDevices = (input = {}) => {
    const config = pick(['moduleId'], input);
    const prepared = db.prepare(sql.getZwaveDevices);

  return prepared.all(config);
};

const addZwaveDevice = (input = {}) => {
  const config = pick(['moduleId', 'nodeId'], input);
  const prepared = db.prepare(sql.addZwaveDevice);

  const { changes } = prepared.run(config);

  return !!changes;
};

const addZwaveDeviceInformation = (input = {}) => {
  const config = pick(['moduleId', 'nodeId', 'manufacturer', 'product', 'type'], input);
  const prepared = db.prepare(sql.addZwaveNodeInformation);

  const { changes } = prepared.run(config);

  return !!changes;
};

const removeZwaveDevice = (input = {}) => {
  const config = pick(['moduleId', 'nodeId'], input);
  const prepared = db.prepare(sql.removeZwaveDevice);

  const { changes } = prepared.run(config);

  return !!changes;
};

////////////////////////////////////////////////////////////////////////////////
/// ZWAVE_DEV_PARAMS
////////////////////////////////////////////////////////////////////////////////

const getZwaveDevParams = (input = {}) => {
  const config = pick(['moduleId', 'nodeId'], input);

  const prepared = db.prepare(sql.getZwaveDeviceParams);
  return prepared.all(config);
};

const getZwaveParamByDevParam = (input = {}) => {
  const config = pick(['paramId'], input);
  const prepared = db.prepare(sql.getZwaveParamByDevParam);

  return prepared.get(config);
};

const getDevParamByZwaveParam = (input = {}) => {
  const config = pick(['moduleId', 'valueId'], input);
  const prepared = db.prepare(sql.getDevParamByZwaveParam);

  return prepared.get(config);
};

const addZwaveDevParam = (input = {}) => {
  const config = pick([
    'moduleId',
    'nodeId',
    'valueId',
    'value',
    'name',
    'units',
    'help',
    'writable',
    'possibleValues'
    ], input
  );

  config.writable |= 0;
  config.value = unless(isNil, (x) => toString(JSON.parse(x))) (config.value);
  config.possibleValues = unless(isNil, toString) (config.possibleValues);
  const prepared = db.prepare(sql.addZwaveDevParam);

  const { changes } = prepared.run(config);

  return !!changes;
};

const updateZwaveDevParam = (input = {}) => {
  const config = pickAll([
    'moduleId',
    'valueId',
    'paramId',
    'value',
    'polled',
    'pollIntensity'
    ], input
  );
  config.polled = unless(isNil, (x) => x |= 0) (config.polled);
  config.value = unless(isNil, (x) => toString(JSON.parse(x))) (config.value);
  const prepared = db.prepare(sql.updateZwaveDevParam);

  const { changes } = prepared.run(config);

  return !!changes;
};

const updateZwaveBasicSet = (input = {}) => {
  const config = pick(['moduleId', 'nodeId', 'value'], input);
  config.value = `${config.value}`;
  const valueId = `${config.nodeId}-BASIC-SET`
  const prepared = db.prepare(sql.updateZwaveBasicSet);

  const { changes } = prepared.run({ ...config, valueId });

  return !!changes;
};

////////////////////////////////////////////////////////////////////////////////
/// Use case specific operations
////////////////////////////////////////////////////////////////////////////////

const createDevType = (input = {}) => {
  const config = pickAll(['type', 'supplier', 'model', 'details', 'params'], input);

  const create = db.transaction((config) => {
    const typeId = addDeviceType(omit(['params'], config));

    config.params.forEach((param) => addTypeParam({ ...param, typeId }));

    return { typeId, paramAddedCount: config.params.length };
  });

  return create(config);
};

const createDevInstance = (input = {}) => {
  const config = pickAll(['typeId', 'name', 'details'], input);
const processZwaveUpdate = (input = {}) => {
  const config = pickAll([
    'moduleId',
    'valueId',
    'value',
    'units',
    'writable',
    'polled',
    'pollIntensity'
    ], input
  );

  const update = db.transaction((config) => {
    updateZwaveDevParam(config);
    const { fk_param_id: paramId } = getDevParamByZwaveParam(
      pick(['moduleId', 'valueId'], config)
    );
    !!paramId && updateDeviceParam({
      ...pick(['value', 'polled'], config),
      paramId
    });

    return {
      paramId,
      ...pick(['moduleId', 'valueId', 'value', 'polled'], config)
    };
  });

  return update(config);
};
  const create = db.transaction((config) => {
    const devId = addDevice(config);
    const typeParams = getTypeParams(pick(['typeId'], config));

    const paramIds = [];

    typeParams.forEach((param) => {
      const parId = addDeviceParam({
        ...param,
        devId,
        paramId: param.fk_param_id,
        protocolId: param.fk_protocol_id,
        datatypeId: param.fk_datatype_id,
        value: param.def_val
      });

      paramIds.push(parId);
    });

    return { devId, paramAddedCount: typeParams.length, paramIds };
  });

  return create(config);
};

const processZwaveUpdate = (input = {}) => {
  const config = pickAll([
    'moduleId',
    'valueId',
    'value',
    'units',
    'writable',
    'polled',
    'pollIntensity'
    ], input
  );

  const update = db.transaction((config) => {
    updateZwaveDevParam(config);
    const { fk_param_id: paramId } = getDevParamByZwaveParam(
      pick(['moduleId', 'valueId'], config)
    );
    !!paramId && updateDeviceParam({
      ...pick(['value', 'polled'], config),
      paramId
    });

    return {
      paramId,
      ...pick(['moduleId', 'valueId', 'value', 'polled'], config)
    };
  });

  return update(config);
};

const processZwaveBasicSet = (input = {}) => {
  const config = pickAll([
    'moduleId',
    'valueId',
    'value',
    ], input
  );

  const update = db.transaction((config) => {
    updateZwaveBasicSet(config);
    const { fk_param_id: paramId } = getDevParamByZwaveParam(
      pick(['moduleId', 'valueId'], config)
    );
    !!paramId && updateDeviceParam({
      ...pick(['value', 'polled'], config),
      paramId
    });

    return {
      paramId,
      ...pick(['moduleId', 'valueId', 'value', 'polled'], config)
    };
  });

  return update(config);
};

const mapZwaveParam = (input = {}) => {
  const config = pick(['paramId', 'moduleId', 'valueId'], input);

  return updateZwaveDevParam(config);
};

////////////////////////////////////////////////////////////////////////////////
/// Exports
////////////////////////////////////////////////////////////////////////////////

module.exports = {
  getParams,
  getParam,
  getProtocols,
  getProtocol,
  getDatatypes,
  getDatatype,
  getDeviceTypes,
  getDeviceType,
  getTypeParams,
  getDevices,
  getDevice,
  getDeviceParams,
  getDeviceParam,
  getAllDeviceParams,
  addParam,
  updateDeviceParam,
  removeDevice,
  getZwaveDevices,
  addZwaveDevice,
  addZwaveDeviceInformation,
  removeZwaveDevice,
  getZwaveDevParams,
  getZwaveParamByDevParam,
  getDevParamByZwaveParam,
  addZwaveDevParam,
  updateZwaveDevParam,
  createDevType,
  createDevInstance,
  processZwaveUpdate,
  processZwaveBasicSet,
  mapZwaveParam
};
