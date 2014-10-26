(function () {


  var Consts = {

    UNCOMPRESSED  : 0,
    DEFLATE       : 1,
    LZMA          : 2,

    AWD_FIELD_INT8      : 1,
    AWD_FIELD_INT16     : 2,
    AWD_FIELD_INT32     : 3,
    AWD_FIELD_UINT8     : 4,
    AWD_FIELD_UINT16    : 5,
    AWD_FIELD_UINT32    : 6,
    AWD_FIELD_FLOAT32   : 7,
    AWD_FIELD_FLOAT64   : 8,
    AWD_FIELD_BOOL      : 21,
    AWD_FIELD_COLOR     : 22,
    AWD_FIELD_BADDR     : 23,
    AWD_FIELD_STRING    : 31,
    AWD_FIELD_BYTEARRAY : 32,
    AWD_FIELD_VECTOR2x1 : 41,
    AWD_FIELD_VECTOR3x1 : 42,
    AWD_FIELD_VECTOR4x1 : 43,
    AWD_FIELD_MTX3x2    : 44,
    AWD_FIELD_MTX3x3    : 45,
    AWD_FIELD_MTX4x3    : 46,
    AWD_FIELD_MTX4x4    : 47,

    BOOL       : 21,
    COLOR      : 22,
    BADDR      : 23,



    INT8    : 1,
    INT16   : 2,
    INT32   : 3,
    UINT8   : 4,
    UINT16  : 5,
    UINT32  : 6,
    FLOAT32 : 7,
    FLOAT64 : 8,


    AWDSTRING    : 31,
    AWDBYTEARRAY : 32,

    MAGIC   : 4282180,



    // TYPES

    GENERIC     : 0,
    GEOMETRY    : 1,
    PRIMITIVE   : 11,
    CONTAINER   : 22,
    MESH        : 23,
    TEXTURE     : 82,
    METADATA    : 255,


    // MODELS

    MODEL_ENTITY                 : 1 << 1,
    MODEL_SKYBOX                 : 1 << 2,
    MODEL_CAMERA                 : 1 << 3,
    MODEL_SEGMENT_SET            : 1 << 4,
    MODEL_MESH                   : 1 << 5,
    MODEL_GEOMETRY               : 1 << 6,
    MODEL_SKELETON               : 1 << 7,
    MODEL_SKELETON_POSE          : 1 << 8,
    MODEL_CONTAINER              : 1 << 9,
    MODEL_TEXTURE                : 1 << 10,
    MODEL_TEXTURE_PROJECTOR      : 1 << 11,
    MODEL_MATERIAL               : 1 << 12,
    MODEL_ANIMATION_SET          : 1 << 13,
    MODEL_ANIMATION_STATE        : 1 << 14,
    MODEL_ANIMATION_NODE         : 1 << 15,
    MODEL_ANIMATOR               : 1 << 16,
    MODEL_STATE_TRANSITION       : 1 << 17,
    MODEL_LIGHT                  : 1 << 18,
    MODEL_LIGHT_PICKER           : 1 << 19,
    MODEL_SHADOW_MAP_METHOD      : 1 << 20,
    MODEL_EFFECTS_METHOD         : 1 << 21,

    MODEL_GENERIC                : ~0,



    // BUFFER TYPES
    POSITION            : 1,
    INDEX               : 2,
    UVS                 : 3,
    NORMAL              : 4,
    TANGENT             : 5,
    JOIN_IDX            : 6,
    JOIN_WGT            : 7,

    DEFAULT_NS                  : 0
  };

  module.exports = Consts;

}());