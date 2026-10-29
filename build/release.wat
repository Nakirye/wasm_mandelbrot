(module
 (type $0 (func (param i32 i32 i32 f64 f64 f64)))
 (type $1 (func (param i32 i32) (result f64)))
 (type $2 (func (param i32 i32 i32 i32)))
 (type $3 (func))
 (type $4 (func (param i32 i32) (result i32)))
 (import "env" "abort" (func $~lib/builtins/abort (param i32 i32 i32 i32)))
 (global $assembly/index/buffer (mut i32) (i32.const 0))
 (global $assembly/index/capacity (mut i32) (i32.const 0))
 (global $~lib/rt/stub/offset (mut i32) (i32.const 0))
 (memory $0 1)
 (data $0 (i32.const 1036) "L")
 (data $0.1 (i32.const 1048) "\04\00\00\000")
 (data $0.2 (i32.const 1062) "6@\00\00\00\00\00\00A@\00\00\00\00\00\80F@\00\00\00\00\00\80_@\00\00\00\00\00\80k@\00\00\00\00\00\c0l@")
 (data $1 (i32.const 1116) "L")
 (data $1.1 (i32.const 1128) "\04\00\00\000")
 (data $1.2 (i32.const 1142) "6@\00\00\00\00\00\00I@\00\00\00\00\00\c0S@\00\00\00\00\00\80c@\00\00\00\00\00\e0j@\00\00\00\00\00`h@")
 (data $2 (i32.const 1196) "L")
 (data $2.1 (i32.const 1208) "\04\00\00\000")
 (data $2.2 (i32.const 1222) "=@\00\00\00\00\00@R@\00\00\00\00\00\c0Y@\00\00\00\00\00\00k@\00\00\00\00\00@g@\00\00\00\00\00\80`@")
 (data $3 (i32.const 1276) "<")
 (data $3.1 (i32.const 1288) "\02\00\00\00(\00\00\00A\00l\00l\00o\00c\00a\00t\00i\00o\00n\00 \00t\00o\00o\00 \00l\00a\00r\00g\00e")
 (data $4 (i32.const 1340) "<")
 (data $4.1 (i32.const 1352) "\02\00\00\00\1e\00\00\00~\00l\00i\00b\00/\00r\00t\00/\00s\00t\00u\00b\00.\00t\00s")
 (data $5 (i32.const 1404) "<")
 (data $5.1 (i32.const 1416) "\02\00\00\00$\00\00\00I\00n\00d\00e\00x\00 \00o\00u\00t\00 \00o\00f\00 \00r\00a\00n\00g\00e")
 (data $6 (i32.const 1468) "<")
 (data $6.1 (i32.const 1480) "\02\00\00\00&\00\00\00~\00l\00i\00b\00/\00s\00t\00a\00t\00i\00c\00a\00r\00r\00a\00y\00.\00t\00s")
 (export "allocBuffer" (func $assembly/index/allocBuffer))
 (export "mandelbrot" (func $assembly/index/mandelbrot))
 (export "mandelbrotSimd" (func $assembly/index/mandelbrotSimd))
 (export "memory" (memory $0))
 (start $~start)
 (func $~lib/staticarray/StaticArray<f64>#__get (param $0 i32) (param $1 i32) (result f64)
  local.get $1
  local.get $0
  i32.const 20
  i32.sub
  i32.load offset=16
  i32.const 3
  i32.shr_u
  i32.ge_u
  if
   i32.const 1424
   i32.const 1488
   i32.const 78
   i32.const 41
   call $~lib/builtins/abort
   unreachable
  end
  local.get $0
  local.get $1
  i32.const 3
  i32.shl
  i32.add
  f64.load
 )
 (func $~start
  i32.const 1532
  global.set $~lib/rt/stub/offset
 )
 (func $assembly/index/mandelbrotSimd (param $0 i32) (param $1 i32) (param $2 i32) (param $3 f64) (param $4 f64) (param $5 f64)
  (local $6 i32)
  (local $7 i32)
  (local $8 i32)
  (local $9 f64)
  (local $10 f64)
  (local $11 v128)
  (local $12 v128)
  (local $13 v128)
  (local $14 f64)
  (local $15 i32)
  (local $16 v128)
  (local $17 v128)
  (local $18 f64)
  (local $19 v128)
  (local $20 v128)
  (local $21 v128)
  (local $22 f64)
  (local $23 f64)
  (local $24 f64)
  (local $25 f64)
  (local $26 i32)
  (local $27 i32)
  (local $28 i32)
  f64.const 3
  local.get $1
  f64.convert_i32_s
  local.tee $9
  local.get $5
  f64.mul
  f64.div
  local.set $10
  local.get $0
  f64.convert_i32_s
  f64.const 0.5
  f64.mul
  local.set $14
  local.get $9
  f64.const 0.5
  f64.mul
  local.set $18
  global.get $assembly/index/buffer
  local.set $6
  loop $for-loop|0
   local.get $1
   local.get $15
   i32.gt_s
   if
    local.get $4
    local.get $15
    f64.convert_i32_s
    local.get $18
    f64.sub
    local.get $10
    f64.mul
    f64.add
    f64x2.splat
    local.set $17
    i32.const 0
    local.set $8
    loop $for-loop|1
     local.get $8
     i32.const 1
     i32.add
     local.tee $7
     local.get $0
     i32.lt_s
     if
      v128.const i32x4 0x00000000 0x00000000 0x00000000 0x00000000
      local.get $3
      local.get $8
      f64.convert_i32_s
      local.get $14
      f64.sub
      local.get $10
      f64.mul
      f64.add
      f64x2.replace_lane 0
      local.get $3
      local.get $7
      f64.convert_i32_s
      local.get $14
      f64.sub
      local.get $10
      f64.mul
      f64.add
      f64x2.replace_lane 1
      local.set $19
      v128.const i32x4 0x00000000 0x00000000 0x00000000 0x00000000
      local.set $11
      v128.const i32x4 0x00000000 0x00000000 0x00000000 0x00000000
      local.set $12
      v128.const i32x4 0x00000000 0x00000000 0x00000000 0x00000000
      local.set $13
      v128.const i32x4 0xffffffff 0xffffffff 0xffffffff 0xffffffff
      local.set $16
      i32.const 0
      local.set $7
      loop $for-loop|2
       local.get $2
       local.get $7
       i32.gt_s
       if
        local.get $16
        local.get $11
        local.get $11
        f64x2.mul
        local.tee $20
        local.get $12
        local.get $12
        f64x2.mul
        local.tee $21
        f64x2.add
        v128.const i32x4 0x00000000 0x40100000 0x00000000 0x40100000
        f64x2.le
        v128.and
        local.tee $16
        v128.any_true
        if
         local.get $13
         local.get $16
         i64x2.sub
         local.set $13
         v128.const i32x4 0x00000000 0x40000000 0x00000000 0x40000000
         local.get $11
         f64x2.mul
         local.get $12
         f64x2.mul
         local.get $17
         f64x2.add
         local.set $12
         local.get $20
         local.get $21
         f64x2.sub
         local.get $19
         f64x2.add
         local.set $11
         local.get $7
         i32.const 1
         i32.add
         local.set $7
         br $for-loop|2
        end
       end
      end
      local.get $6
      local.get $13
      i64x2.extract_lane 0
      i32.wrap_i64
      local.tee $7
      local.get $2
      i32.ge_s
      if (result i32)
       i32.const -14871018
      else
       local.get $7
       f64.convert_i32_s
       local.get $2
       f64.convert_i32_s
       f64.div
       f64.sqrt
       f64.sqrt
       f64.const 5
       f64.mul
       local.tee $5
       i32.trunc_sat_f64_s
       local.tee $7
       i32.const 1
       i32.add
       local.set $26
       i32.const 1056
       local.get $7
       call $~lib/staticarray/StaticArray<f64>#__get
       i32.const 1056
       local.get $26
       call $~lib/staticarray/StaticArray<f64>#__get
       i32.const 1056
       local.get $7
       call $~lib/staticarray/StaticArray<f64>#__get
       f64.sub
       local.get $5
       local.get $7
       f64.convert_i32_s
       f64.sub
       local.tee $5
       f64.mul
       f64.add
       i32.trunc_sat_f64_u
       local.set $27
       i32.const 1136
       local.get $7
       call $~lib/staticarray/StaticArray<f64>#__get
       i32.const 1136
       local.get $26
       call $~lib/staticarray/StaticArray<f64>#__get
       i32.const 1136
       local.get $7
       call $~lib/staticarray/StaticArray<f64>#__get
       f64.sub
       local.get $5
       f64.mul
       f64.add
       i32.trunc_sat_f64_u
       local.set $28
       i32.const 1216
       local.get $7
       call $~lib/staticarray/StaticArray<f64>#__get
       i32.const 1216
       local.get $26
       call $~lib/staticarray/StaticArray<f64>#__get
       i32.const 1216
       local.get $7
       call $~lib/staticarray/StaticArray<f64>#__get
       f64.sub
       local.get $5
       f64.mul
       f64.add
       i32.trunc_sat_f64_u
       i32.const 16
       i32.shl
       i32.const -16777216
       i32.or
       local.get $28
       i32.const 8
       i32.shl
       i32.or
       local.get $27
       i32.or
      end
      i32.store
      local.get $6
      local.get $13
      i64x2.extract_lane 1
      i32.wrap_i64
      local.tee $7
      local.get $2
      i32.ge_s
      if (result i32)
       i32.const -14871018
      else
       local.get $7
       f64.convert_i32_s
       local.get $2
       f64.convert_i32_s
       f64.div
       f64.sqrt
       f64.sqrt
       f64.const 5
       f64.mul
       local.tee $5
       i32.trunc_sat_f64_s
       local.tee $7
       i32.const 1
       i32.add
       local.set $26
       i32.const 1056
       local.get $7
       call $~lib/staticarray/StaticArray<f64>#__get
       i32.const 1056
       local.get $26
       call $~lib/staticarray/StaticArray<f64>#__get
       i32.const 1056
       local.get $7
       call $~lib/staticarray/StaticArray<f64>#__get
       f64.sub
       local.get $5
       local.get $7
       f64.convert_i32_s
       f64.sub
       local.tee $5
       f64.mul
       f64.add
       i32.trunc_sat_f64_u
       local.set $27
       i32.const 1136
       local.get $7
       call $~lib/staticarray/StaticArray<f64>#__get
       i32.const 1136
       local.get $26
       call $~lib/staticarray/StaticArray<f64>#__get
       i32.const 1136
       local.get $7
       call $~lib/staticarray/StaticArray<f64>#__get
       f64.sub
       local.get $5
       f64.mul
       f64.add
       i32.trunc_sat_f64_u
       local.set $28
       i32.const 1216
       local.get $7
       call $~lib/staticarray/StaticArray<f64>#__get
       i32.const 1216
       local.get $26
       call $~lib/staticarray/StaticArray<f64>#__get
       i32.const 1216
       local.get $7
       call $~lib/staticarray/StaticArray<f64>#__get
       f64.sub
       local.get $5
       f64.mul
       f64.add
       i32.trunc_sat_f64_u
       i32.const 16
       i32.shl
       i32.const -16777216
       i32.or
       local.get $28
       i32.const 8
       i32.shl
       i32.or
       local.get $27
       i32.or
      end
      i32.store offset=4
      local.get $6
      i32.const 8
      i32.add
      local.set $6
      local.get $8
      i32.const 2
      i32.add
      local.set $8
      br $for-loop|1
     end
    end
    local.get $0
    local.get $8
    i32.gt_s
    if
     local.get $3
     local.get $8
     f64.convert_i32_s
     local.get $14
     f64.sub
     local.get $10
     f64.mul
     f64.add
     local.set $22
     local.get $17
     f64x2.extract_lane 0
     local.set $23
     f64.const 0
     local.set $5
     f64.const 0
     local.set $9
     i32.const 0
     local.set $7
     loop $while-continue|3
      local.get $2
      local.get $7
      i32.gt_s
      local.get $5
      local.get $5
      f64.mul
      local.tee $24
      local.get $9
      local.get $9
      f64.mul
      local.tee $25
      f64.add
      f64.const 4
      f64.le
      i32.and
      if
       local.get $5
       local.get $5
       f64.add
       local.get $9
       f64.mul
       local.get $23
       f64.add
       local.set $9
       local.get $24
       local.get $25
       f64.sub
       local.get $22
       f64.add
       local.set $5
       local.get $7
       i32.const 1
       i32.add
       local.set $7
       br $while-continue|3
      end
     end
     local.get $6
     local.get $2
     local.get $7
     i32.le_s
     if (result i32)
      i32.const -14871018
     else
      local.get $7
      f64.convert_i32_s
      local.get $2
      f64.convert_i32_s
      f64.div
      f64.sqrt
      f64.sqrt
      f64.const 5
      f64.mul
      local.tee $5
      i32.trunc_sat_f64_s
      local.tee $7
      i32.const 1
      i32.add
      local.set $8
      i32.const 1056
      local.get $7
      call $~lib/staticarray/StaticArray<f64>#__get
      i32.const 1056
      local.get $8
      call $~lib/staticarray/StaticArray<f64>#__get
      i32.const 1056
      local.get $7
      call $~lib/staticarray/StaticArray<f64>#__get
      f64.sub
      local.get $5
      local.get $7
      f64.convert_i32_s
      f64.sub
      local.tee $5
      f64.mul
      f64.add
      i32.trunc_sat_f64_u
      local.set $26
      i32.const 1136
      local.get $7
      call $~lib/staticarray/StaticArray<f64>#__get
      i32.const 1136
      local.get $8
      call $~lib/staticarray/StaticArray<f64>#__get
      i32.const 1136
      local.get $7
      call $~lib/staticarray/StaticArray<f64>#__get
      f64.sub
      local.get $5
      f64.mul
      f64.add
      i32.trunc_sat_f64_u
      local.set $27
      i32.const 1216
      local.get $7
      call $~lib/staticarray/StaticArray<f64>#__get
      i32.const 1216
      local.get $8
      call $~lib/staticarray/StaticArray<f64>#__get
      i32.const 1216
      local.get $7
      call $~lib/staticarray/StaticArray<f64>#__get
      f64.sub
      local.get $5
      f64.mul
      f64.add
      i32.trunc_sat_f64_u
      i32.const 16
      i32.shl
      i32.const -16777216
      i32.or
      local.get $27
      i32.const 8
      i32.shl
      i32.or
      local.get $26
      i32.or
     end
     i32.store
     local.get $6
     i32.const 4
     i32.add
     local.set $6
    end
    local.get $15
    i32.const 1
    i32.add
    local.set $15
    br $for-loop|0
   end
  end
 )
 (func $assembly/index/mandelbrot (param $0 i32) (param $1 i32) (param $2 i32) (param $3 f64) (param $4 f64) (param $5 f64)
  (local $6 i32)
  (local $7 f64)
  (local $8 i32)
  (local $9 i32)
  (local $10 i32)
  (local $11 f64)
  (local $12 f64)
  (local $13 f64)
  (local $14 f64)
  (local $15 f64)
  (local $16 f64)
  (local $17 f64)
  (local $18 i32)
  (local $19 i32)
  (local $20 i32)
  f64.const 3
  local.get $1
  f64.convert_i32_s
  local.tee $7
  local.get $5
  f64.mul
  f64.div
  local.set $11
  local.get $0
  f64.convert_i32_s
  f64.const 0.5
  f64.mul
  local.set $12
  local.get $7
  f64.const 0.5
  f64.mul
  local.set $13
  global.get $assembly/index/buffer
  local.set $9
  loop $for-loop|0
   local.get $1
   local.get $10
   i32.gt_s
   if
    local.get $4
    local.get $10
    f64.convert_i32_s
    local.get $13
    f64.sub
    local.get $11
    f64.mul
    f64.add
    local.set $14
    i32.const 0
    local.set $8
    loop $for-loop|1
     local.get $0
     local.get $8
     i32.gt_s
     if
      local.get $3
      local.get $8
      f64.convert_i32_s
      local.get $12
      f64.sub
      local.get $11
      f64.mul
      f64.add
      local.set $15
      f64.const 0
      local.set $5
      f64.const 0
      local.set $7
      i32.const 0
      local.set $6
      loop $while-continue|2
       local.get $2
       local.get $6
       i32.gt_s
       local.get $5
       local.get $5
       f64.mul
       local.tee $16
       local.get $7
       local.get $7
       f64.mul
       local.tee $17
       f64.add
       f64.const 4
       f64.le
       i32.and
       if
        local.get $5
        local.get $5
        f64.add
        local.get $7
        f64.mul
        local.get $14
        f64.add
        local.set $7
        local.get $16
        local.get $17
        f64.sub
        local.get $15
        f64.add
        local.set $5
        local.get $6
        i32.const 1
        i32.add
        local.set $6
        br $while-continue|2
       end
      end
      local.get $9
      local.get $2
      local.get $6
      i32.le_s
      if (result i32)
       i32.const -14871018
      else
       local.get $6
       f64.convert_i32_s
       local.get $2
       f64.convert_i32_s
       f64.div
       f64.sqrt
       f64.sqrt
       f64.const 5
       f64.mul
       local.tee $5
       i32.trunc_sat_f64_s
       local.tee $19
       i32.const 1
       i32.add
       local.set $20
       i32.const 1056
       local.get $19
       call $~lib/staticarray/StaticArray<f64>#__get
       i32.const 1056
       local.get $20
       call $~lib/staticarray/StaticArray<f64>#__get
       i32.const 1056
       local.get $19
       call $~lib/staticarray/StaticArray<f64>#__get
       f64.sub
       local.get $5
       local.get $19
       f64.convert_i32_s
       f64.sub
       local.tee $5
       f64.mul
       f64.add
       i32.trunc_sat_f64_u
       local.set $6
       i32.const 1136
       local.get $19
       call $~lib/staticarray/StaticArray<f64>#__get
       i32.const 1136
       local.get $20
       call $~lib/staticarray/StaticArray<f64>#__get
       i32.const 1136
       local.get $19
       call $~lib/staticarray/StaticArray<f64>#__get
       f64.sub
       local.get $5
       f64.mul
       f64.add
       i32.trunc_sat_f64_u
       local.set $18
       i32.const 1216
       local.get $19
       call $~lib/staticarray/StaticArray<f64>#__get
       i32.const 1216
       local.get $20
       call $~lib/staticarray/StaticArray<f64>#__get
       i32.const 1216
       local.get $19
       call $~lib/staticarray/StaticArray<f64>#__get
       f64.sub
       local.get $5
       f64.mul
       f64.add
       i32.trunc_sat_f64_u
       i32.const 16
       i32.shl
       i32.const -16777216
       i32.or
       local.get $18
       i32.const 8
       i32.shl
       i32.or
       local.get $6
       i32.or
      end
      i32.store
      local.get $9
      i32.const 4
      i32.add
      local.set $9
      local.get $8
      i32.const 1
      i32.add
      local.set $8
      br $for-loop|1
     end
    end
    local.get $10
    i32.const 1
    i32.add
    local.set $10
    br $for-loop|0
   end
  end
 )
 (func $assembly/index/allocBuffer (param $0 i32) (param $1 i32) (result i32)
  (local $2 i32)
  (local $3 i32)
  (local $4 i32)
  (local $5 i32)
  local.get $0
  local.get $1
  i32.mul
  i32.const 2
  i32.shl
  local.tee $1
  global.get $assembly/index/capacity
  i32.gt_s
  if
   local.get $1
   i32.const 1073741820
   i32.gt_u
   if
    i32.const 1296
    i32.const 1360
    i32.const 33
    i32.const 29
    call $~lib/builtins/abort
    unreachable
   end
   global.get $~lib/rt/stub/offset
   i32.const 4
   i32.add
   local.tee $3
   local.get $1
   i32.const 19
   i32.add
   i32.const -16
   i32.and
   i32.const 4
   i32.sub
   local.tee $0
   i32.add
   local.tee $2
   memory.size
   local.tee $4
   i32.const 16
   i32.shl
   i32.const 15
   i32.add
   i32.const -16
   i32.and
   local.tee $5
   i32.gt_u
   if
    local.get $4
    local.get $2
    local.get $5
    i32.sub
    i32.const 65535
    i32.add
    i32.const -65536
    i32.and
    i32.const 16
    i32.shr_u
    local.tee $5
    local.get $4
    local.get $5
    i32.gt_s
    select
    memory.grow
    i32.const 0
    i32.lt_s
    if
     local.get $5
     memory.grow
     i32.const 0
     i32.lt_s
     if
      unreachable
     end
    end
   end
   global.get $~lib/rt/stub/offset
   local.get $2
   global.set $~lib/rt/stub/offset
   local.get $0
   i32.store
   local.get $3
   global.set $assembly/index/buffer
   local.get $1
   global.set $assembly/index/capacity
  end
  global.get $assembly/index/buffer
 )
)
