class GraphletJS {

  constructor() {
    console.log("Lib constructor called", this.myVar);
    this.crudList('dancetastic')
  }

  myVar = true;

  /**************/
  /**** utils ***/
  /**************/

  genRandomToken = (list, len) => {
    let newId = [...Array(len)]
                   .map(() => Math.floor(Math.random() * 16)
                      .toString(16)).join('')

    // uniqueness check if there's a list to check against
    if (list && list.length > 0) {
      let idsList = list.filter(node => node['core_props']['id'] === newId)
      if (idsList.length > 0) {
        newId = this.getRandomToken(list, len)
      }
    }

    return newId
  }

  doesKeyExist = (node, key) => {
    return Object.keys().includes(key) ? true : false
  }

  doesValTypeMatch = (key, val) => {
    let keyType = key.slice(0,3)
    if (keyType === 'rel') {
      keyType = 'arr'
    } else {
      keyType = null
    }

    let valType = Object.prototype.toString.call(val).slice(8,11).toLowerCase()

    return keyType === valType
  }

  getDateUpdatedObj = (user) => {
    return Math.floor(Date.now()/1000)+user
  }

  /**************************************/
  /** crudList highest level functions **/
  /**************************************/

  renderHelp = () => {
    console.log('\n\nHELP\n====\nmethod')
    console.log('INIT_LIST ....... create a list containing one Label object')
    console.log('VALIDATE_OBJECT ...')
    console.log('VALIDATE_LIST .....')
    console.log('CREATE')
    console.log('READ')
    console.log('UPDATE')
    console.log('DELETE\n')
  }

  initLabelObject = (list, user) => {
    return {
      "core_props": {
        "id": this.getRandomToken(list, 16),
        "date_updated": [Math.floor(Date.now()/1000)+user],
        "label": "Label"
      },
      "label_props": {
        "strLabel": "Label",
        "strLabelDescription": "A capitalized single word...",
        "relRelatedNodes": []
      }
    }
  }

  initList = (list, user) => {
    console.log('initList', user)
    if (!user || user === '') {
      console.log('ERROR: USER_STR_INVALID', user)
      return null
    }

    return [this.initLabelObject(list, user)]
  }

  validateList = (list, nodeToValidate, fixNode) => {
    let message = "INCOMPLETE"

    // Does the list exist?

    // Does at least one original Label object exist?

    // Do all nodes in the list pass the validity check?

    // Are there any orphans?
       // return a list of their ids

    // Are there any duplicate ids?
       // if you fix, propagate to related nodes
       // and report the changes

    // Generate a label node from a node's label_props
    // in case that label node does not exist

    return message

  }

  validateObject = (list, fixList) => {
    let message = "INCOMPLETE"
    // TODO: where does obj come from? it needs an assignment
    let obj

    // Check that only the desired two keys are present
    let keys = Object.keys(obj)
    let flag = keys.includes('core_props') && keys.includes('label_props') && keys.length === 2
    message = "SUCCESS"

    // Check that all related node ids are valid ids

    // Check that all related nodes contain a backlink in one of their relProps

    // Check that all core_props keys and desired value types are as expected

    // Check that all label_props keys begin with

    // Check that all label_props keys' prefixes correspond to the value types

    // CHeck that every node has a "relRelatedNodes" label_prop

    message = "INCOMPLETE"
    return message
  }

  validateUniqueId = (list, nodeId, fixUniqueness) => {
    let message = "INCOMPLETE"

    // get an array of indices of all matching objects

    let indexes = list.map((node, idx) => node['core_props']['id'] === nodeId
                                          ? idx
                                          : null).filter(String);

    if (indexes.length === 0) {
      console.log("ID NOT FOUND")
    } else if (indexes.length > 1) {
      console.log("MULTIPLE IDS FOUND")
      console.log("if fixUniqueness is true, will attempt to fix and return fixed list")
    } else {
      console.log("NODE ID EXISTS AND IS UNIQUE")
    }

    return message
  }


  getListOfLabels = (list, returnType) => {
    list = list.filter(node => node['core_props']['label'] === 'Label')
    if (returnType === 'ids') {
      return list.map(node => node['core_props']['id'])
    } else {
      return list
    }
  }


  getNodesByKeyPair = (list, keyset, key, val,
                       returnType, firstOnly, labelToFilter) => {
    let listToReturn = []

    if (labelToFilter) {
      listToReturn = list.filter(node => node['core_props']['label'] === labelToFilter
                                         && node[keyset][key] === val)
    } else {
      listToReturn = list.filter(node => node[keyset][key] === val)
    }

    if (returnType === 'objects') {
      if (firstOnly) {
        return [listToReturn[0]]
      } else {
        return listToReturn
      }
    } else if (returnType === 'ids') {
      if (firstOnly) {
        return [listToReturn.map(node => node['core_props']['id'])[0]]
      } else {
        return listToReturn.map(node => node['core_props']['id'])
      }
    } else {
      console.log('ERROR_INVALID_RETURNTYPE')
      return []
    }
  }


  getListOfRelNodes = (sourceNode, returnType) => {

    let listToReturn = []

    let keys = Object.keys()
                 .filter(key => key.slice(0,3) === 'rel')

    for (let k=0; k < keys.length; k++) {
      let idList = sourceNode['label_props'][k]
      for (let i=0; i < idList.length; i++) {
        listToReturn.push(idList[i])
      }
    }

    return listToReturn
  }

  /**************/
  /** crudList **/
  /**************/

  crudList = (op, options) => {

    switch(op) {
      case 'HELP':  // done
        return this.renderHelp()

      case 'INIT_LABEL_OBJECT':  // done
        return this.initLabelObject(options["list"],
                               options["user"])

      case 'INIT_LIST':  // done
        return this.initList(options["list"],
                        options["user"])

      case 'VALIDATE_OBJECT':
        return this.validateObject(options["list"],
                              options["nodeToValidate"],
                              options["fixNode"])

      case 'VALIDATE_LIST':
        return this.validateList(options["list"],
                            options["fixList"])

      case 'VALIDATE_UNIQUE':
        return this.validateUniqueId(options["list"],
                                options["nodeId"],
                                options["fixUniqueness"])

      case 'READ_LIST_OF_LABELS':
        return this.getListOfLabels(options["list"],
                               options["returnType"])

      case 'READ_NODE_BY_KEYPAIR':
        return this.getNodeByKeypair(options["list"],
                                options["keyset"],
                                options["key"],
                                options["val"],
                                options["returnType"],
                                options["firstOnly"],
                                options["labelToFilter"])

      case 'CREATE_NODE_FROM_LABEL':
        return this.getNodeFromLabelObj(options["list"],
                                   options["label"])

      case 'ADD_NODE':
        return this.addNode(options["list"],
                       options["nodeToAdd"])

      case 'REMOVE_NODE':
        return this.removeNode(options["list"],
                          options["nodeToRemove"])

      case 'UPDATE_CHANGE_ID':
        return this.changeNodeIdInList(options["list"],
                                  options["nodeToUpdate"],
                                  options["oldId"],
                                  options["newId"])

      case 'UPDATE_ADD_KEYPAIR':
        return this.updateAddKeypair(options["list"],
                                options["nodeToUpdate"],
                                options["keyset"],
                                options["keyToAdd"],
                                options["valToAdd"])

      case 'UPDATE_REMOVE_KEYPAIR':
        return this.updateRemoveKeypair(options["list"],
                                   options["nodeToUpdate"],
                                   options["keyset"],
                                   options["keyToRemove"])


      case 'UPDATE_RENAME_KEY':
        return this.updateRenameKey(options["list"],
                               options["nodeToUpdate"],
                               options["keyset"],
                               options["oldKey"],
                               options["newKey"])

      case 'UPDATE_CHANGE_VALUE':
        return this.updateChangeVal(options["list"],
                               options["nodeToUpdate"],
                               options["keyset"],
                               options["key"],
                               options["newVal"])

      default:
        console.log("NO_OPS_PERFORMED")
        return null
    }
  }

}

export default GraphletJS;
