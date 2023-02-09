# GraphletJS

GraphletJS is a JavaScript library for managing an extensible property graph database in the form of a simple unordered list of objects.

`db = [{...}, {...}, {...}]`

The objects are called nodes.

## Operations

GraphletJS can perform the following operations on the list of nodes.

1. Validate and/or repair a property graph database
1. Find individual nodes in the list by key:value pairs
1. Add a new node to the list
1. Remove an existing node from the list
1. Update an existing node in place in the list
1. Add and remove keypairs to every node of a given label
1. Enforce bidirectional inter-node relationships at all times

## Lists and Nodes

**Valid Lists**

GraphletJS works with a very narrow definition of a valid list. Lists must contain at least one node, and the only valid node in a single-node list is a node with the core property label of `Label` and the following three label properties. 

```
{
  "core_props": {
    "date_updated": ["1675914159admin", "1675914165jdoe"],
    "id": "aaa",
    "label": "Label"
  },
  "label_props": {
    "strLabel": "Label",
    "strLabelDescription": "This label provides the base template from which all other nodes will be derived.",
    "relRelatedNodes": []
  }
}
```

**Core Properties**

Every node must carry the `core_props` object with exactly the following three required properties.

1. The `date_updated` expects a list of strings composed of a 10-digit Unix timestamp and the string name of a user to identify when and by whom the node has been updated over the entire course of its life. 

1. The `id` must be a string but can consist of any characters. If JSON readability is a concern, it's best to create a human-understandable id string. IDs must be unique; no two nodes in the same list can share the same id string. Relationships between nodes are indicated by properties such as `relRelatedKeywords` that contain a list of id strings. 

1. The 'label' must be a single word of text in camel case, such as `Keyword` or `ItemAcquisitionRecord`. 

**Expanding the List**

If there are two nodes, the second node must be a label of the type `Label` that describes a second type of node.

```
{
  "core_props": {
    "date_updated": ["1675914159admin", "1675914165jdoe"],
    "id": "bbb",
    "label": "Label"
  },
  "label_props": {
    "strLabel": "Keyword",
    "strLabelDescription": "A topic sentence, similar to a tag.",
    "boolVisible": true,
    "listFiles": [],
    "radioKeywordType": "",
    "relRelatedNodes": [],
    "strText": "",
  }
}
```

This is a Label node. All nodes of the same label have the same set of `label_props`. We use Label nodes to define different sets of properties, that are then used in different kinds of nodes. For example, a museum's database might need to contain nodes with very different property requirements, as diverse as Item, ItemAcquisitionRecord, Keyword, User, Note, Exhibit, and List.

If the list contains additional nodes, a Label node must exist for every different label of the contained nodes. When GraphhletJS finds a node that has no corresponding Label node, the library will create one from the label properties in that node, to maintain the internal consistency. 

Expanding on the museum example, any Keyword nodes would have a `core_props` `label` of "Keyword" and (possibly) the five additional properties shown:

```
{
  "core_props": {
  "date_updated": ["1675914159admin", "1675914165jdoe"],
    "id": "ccc",
  "label": "Keyword"
  },
  "label_props": {
    "boolVisible": true,
    "listFiles": [],
    "radioKeywordType": "Place",
    "relRelatedNodes": ["eee", "fff"],
    "strText": "Cowtown"
  }
}
```

**Label Properties**

GraphletJS enforces bidirectional links between nodes, so the library needs understand what properties are lists of related nodes and which properties contain data that can be safely ignored. Each label property's key must start with one of the following five prefixes, and the corresponding value must be of the expected type. 

|Prefix|Type|Searchable|Value|
|---|---|---|---|
|bool|Boolean|yes|true or false|
|list|List|no|Any|
|radio|Radio|yes|Any valid string|
|rel|List|yes|List of node id strings for looking up other nodes|
|str|String|yes|Any valid string|

GraphletJS uses the `rel` prefix to identify related nodes so it can enforce bidirectional linking. This is why the `label_props` must contain at least one property, `relRelatedNodes`, so the library has a default property in which to store and find related node ids.

```
{
  "core_props": {
    "date_updated": ["1675914159admin", "1675914165jdoe"],
    "id": "eee",
    "label": "Item"
  },
  "label_props": {
    "relRelatedNodes": ["ccc]
  }
}
```
