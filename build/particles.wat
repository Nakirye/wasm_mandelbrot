(module
 (type $0 (func))
 (type $1 (func (param i32) (result i32)))
 (type $2 (func (param i32 i32 i32 i32)))
 (type $3 (func (result i32)))
 (type $4 (func (param i32 i32 i32 i32) (result i32)))
 (import "env" "abort" (func $~lib/builtins/abort (param i32 i32 i32 i32)))
 (global $assembly/particles/width (mut i32) (i32.const 0))
 (global $assembly/particles/height (mut i32) (i32.const 0))
 (global $assembly/particles/capacity (mut i32) (i32.const 0))
 (global $assembly/particles/count (mut i32) (i32.const 0))
 (global $assembly/particles/seed (mut i32) (i32.const 1))
 (global $assembly/particles/rocketsPerStep (mut f64) (f64.const 0))
 (global $assembly/particles/rocketAcc (mut f64) (f64.const 0))
 (global $assembly/particles/intensity (mut f64) (f64.const 1))
 (global $assembly/particles/xs (mut i32) (i32.const 0))
 (global $assembly/particles/ys (mut i32) (i32.const 0))
 (global $assembly/particles/vxs (mut i32) (i32.const 0))
 (global $assembly/particles/vys (mut i32) (i32.const 0))
 (global $assembly/particles/lifes (mut i32) (i32.const 0))
 (global $assembly/particles/colors (mut i32) (i32.const 0))
 (global $assembly/particles/rockets (mut i32) (i32.const 0))
 (global $assembly/particles/frame (mut i32) (i32.const 0))
 (global $assembly/particles/explX (mut i32) (i32.const 0))
 (global $assembly/particles/explY (mut i32) (i32.const 0))
 (global $assembly/particles/explC (mut i32) (i32.const 0))
 (global $assembly/particles/allocated (mut i32) (i32.const 0))
 (global $assembly/particles/allocatedFrame (mut i32) (i32.const 0))
 (global $~lib/rt/stub/offset (mut i32) (i32.const 0))
 (memory $0 1)
 (data $0 (i32.const 1036) ",")
 (data $0.1 (i32.const 1048) "\04\00\00\00\18\00\00\00\e6\c3\84\ff~\9c\d8\ff\95\7f\b8\ffz\a8\9f\ff\d2~\99\ff\ff\a0f\ff")
 (data $1 (i32.const 1084) "<")
 (data $1.1 (i32.const 1096) "\02\00\00\00(\00\00\00A\00l\00l\00o\00c\00a\00t\00i\00o\00n\00 \00t\00o\00o\00 \00l\00a\00r\00g\00e")
 (data $2 (i32.const 1148) "<")
 (data $2.1 (i32.const 1160) "\02\00\00\00\1e\00\00\00~\00l\00i\00b\00/\00r\00t\00/\00s\00t\00u\00b\00.\00t\00s")
 (data $3 (i32.const 1212) "<")
 (data $3.1 (i32.const 1224) "\02\00\00\00$\00\00\00I\00n\00d\00e\00x\00 \00o\00u\00t\00 \00o\00f\00 \00r\00a\00n\00g\00e")
 (data $4 (i32.const 1276) "<")
 (data $4.1 (i32.const 1288) "\02\00\00\00&\00\00\00~\00l\00i\00b\00/\00s\00t\00a\00t\00i\00c\00a\00r\00r\00a\00y\00.\00t\00s")
 (export "init" (func $assembly/particles/init))
 (export "particleCount" (func $assembly/particles/particleCount))
 (export "step" (func $assembly/particles/step))
 (export "memory" (memory $0))
 (start $~start)
 (func $~lib/rt/stub/__alloc (param $0 i32) (result i32)
  (local $1 i32)
  (local $2 i32)
  (local $3 i32)
  (local $4 i32)
  local.get $0
  i32.const 1073741820
  i32.gt_u
  if
   i32.const 1104
   i32.const 1168
   i32.const 33
   i32.const 29
   call $~lib/builtins/abort
   unreachable
  end
  global.get $~lib/rt/stub/offset
  i32.const 4
  i32.add
  local.tee $1
  local.get $0
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
  local.tee $3
  i32.const 16
  i32.shl
  i32.const 15
  i32.add
  i32.const -16
  i32.and
  local.tee $4
  i32.gt_u
  if
   local.get $3
   local.get $2
   local.get $4
   i32.sub
   i32.const 65535
   i32.add
   i32.const -65536
   i32.and
   i32.const 16
   i32.shr_u
   local.tee $4
   local.get $3
   local.get $4
   i32.gt_s
   select
   memory.grow
   i32.const 0
   i32.lt_s
   if
    local.get $4
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
  local.get $1
 )
 (func $~start
  i32.const 1340
  global.set $~lib/rt/stub/offset
 )
 (func $assembly/particles/step
  (local $0 i32)
  (local $1 i32)
  (local $2 i32)
  (local $3 f64)
  (local $4 f64)
  (local $5 f64)
  (local $6 f64)
  (local $7 i32)
  (local $8 i32)
  (local $9 i32)
  (local $10 f64)
  (local $11 f64)
  (local $12 i32)
  (local $13 i32)
  global.get $assembly/particles/rocketAcc
  global.get $assembly/particles/rocketsPerStep
  f64.add
  global.set $assembly/particles/rocketAcc
  loop $while-continue|0
   global.get $assembly/particles/rocketAcc
   f64.const 1
   f64.ge
   if
    global.get $assembly/particles/rocketAcc
    f64.const -1
    f64.add
    global.set $assembly/particles/rocketAcc
    global.get $assembly/particles/count
    global.get $assembly/particles/capacity
    i32.lt_s
    if
     global.get $assembly/particles/count
     local.tee $7
     i32.const 1
     i32.add
     global.set $assembly/particles/count
     global.get $assembly/particles/seed
     local.tee $8
     local.get $8
     i32.const 13
     i32.shl
     i32.xor
     local.tee $8
     local.get $8
     i32.const 17
     i32.shr_u
     i32.xor
     local.tee $8
     local.get $8
     i32.const 5
     i32.shl
     i32.xor
     local.tee $8
     global.set $assembly/particles/seed
     local.get $7
     i32.const 3
     i32.shl
     local.tee $9
     global.get $assembly/particles/xs
     i32.add
     local.get $8
     f64.convert_i32_u
     f64.const 2.3283064365386963e-10
     f64.mul
     global.get $assembly/particles/width
     f64.convert_i32_s
     f64.mul
     f64.store
     global.get $assembly/particles/ys
     local.get $9
     i32.add
     global.get $assembly/particles/height
     f64.convert_i32_s
     f64.store
     global.get $assembly/particles/seed
     local.tee $8
     local.get $8
     i32.const 13
     i32.shl
     i32.xor
     local.tee $8
     local.get $8
     i32.const 17
     i32.shr_u
     i32.xor
     local.tee $8
     local.get $8
     i32.const 5
     i32.shl
     i32.xor
     local.tee $8
     global.set $assembly/particles/seed
     global.get $assembly/particles/vxs
     local.get $9
     i32.add
     local.get $8
     f64.convert_i32_u
     f64.const 2.3283064365386963e-10
     f64.mul
     f64.const -0.5
     f64.add
     f64.const 60
     f64.mul
     f64.store
     global.get $assembly/particles/seed
     local.tee $8
     local.get $8
     i32.const 13
     i32.shl
     i32.xor
     local.tee $8
     local.get $8
     i32.const 17
     i32.shr_u
     i32.xor
     local.tee $8
     local.get $8
     i32.const 5
     i32.shl
     i32.xor
     local.tee $8
     global.set $assembly/particles/seed
     global.get $assembly/particles/vys
     local.get $9
     i32.add
     local.get $8
     f64.convert_i32_u
     f64.const 2.3283064365386963e-10
     f64.mul
     f64.const 140
     f64.mul
     f64.const 340
     f64.add
     f64.neg
     f64.store
     global.get $assembly/particles/seed
     local.tee $8
     local.get $8
     i32.const 13
     i32.shl
     i32.xor
     local.tee $8
     local.get $8
     i32.const 17
     i32.shr_u
     i32.xor
     local.tee $8
     local.get $8
     i32.const 5
     i32.shl
     i32.xor
     local.tee $8
     global.set $assembly/particles/seed
     global.get $assembly/particles/lifes
     local.get $9
     i32.add
     local.get $8
     f64.convert_i32_u
     f64.const 2.3283064365386963e-10
     f64.mul
     f64.const 0.6
     f64.mul
     f64.const 0.9
     f64.add
     f64.store
     global.get $assembly/particles/colors
     local.get $7
     i32.const 2
     i32.shl
     i32.add
     global.get $assembly/particles/seed
     local.tee $9
     local.get $9
     i32.const 13
     i32.shl
     i32.xor
     local.tee $9
     local.get $9
     i32.const 17
     i32.shr_u
     i32.xor
     local.tee $9
     local.get $9
     i32.const 5
     i32.shl
     i32.xor
     local.tee $9
     global.set $assembly/particles/seed
     local.get $9
     f64.convert_i32_u
     f64.const 2.3283064365386963e-10
     f64.mul
     f64.const 6
     f64.mul
     i32.trunc_sat_f64_s
     local.tee $9
     i32.const 1052
     i32.load
     i32.const 2
     i32.shr_u
     i32.ge_u
     if
      i32.const 1232
      i32.const 1296
      i32.const 78
      i32.const 41
      call $~lib/builtins/abort
      unreachable
     end
     local.get $9
     i32.const 2
     i32.shl
     i32.const 1056
     i32.add
     i32.load
     i32.store
     global.get $assembly/particles/rockets
     local.get $7
     i32.const 2
     i32.shl
     i32.add
     i32.const 1
     i32.store
    end
    br $while-continue|0
   end
  end
  global.get $assembly/particles/width
  global.get $assembly/particles/height
  i32.mul
  local.set $7
  loop $for-loop|1
   local.get $1
   local.get $7
   i32.lt_s
   if
    global.get $assembly/particles/frame
    local.get $1
    i32.const 2
    i32.shl
    i32.add
    local.tee $8
    i32.load
    local.set $9
    local.get $8
    local.get $9
    i32.const 1
    i32.shr_u
    i32.const 2139062143
    i32.and
    local.get $9
    i32.const 2
    i32.shr_u
    i32.const 1061109567
    i32.and
    i32.add
    i32.const -16777216
    i32.or
    i32.store
    local.get $1
    i32.const 1
    i32.add
    local.set $1
    br $for-loop|1
   end
  end
  i32.const 0
  local.set $1
  loop $for-loop|2
   local.get $1
   global.get $assembly/particles/count
   i32.lt_s
   if
    local.get $1
    i32.const 3
    i32.shl
    local.tee $7
    global.get $assembly/particles/vxs
    i32.add
    f64.load
    f64.const 0.985
    f64.mul
    local.set $3
    global.get $assembly/particles/xs
    local.get $7
    i32.add
    f64.load
    local.get $3
    f64.const 0.016666666666666666
    f64.mul
    f64.add
    local.set $5
    global.get $assembly/particles/ys
    local.get $7
    i32.add
    f64.load
    global.get $assembly/particles/vys
    local.get $7
    i32.add
    f64.load
    f64.const 0.985
    f64.mul
    f64.const 2
    f64.add
    local.tee $4
    f64.const 0.016666666666666666
    f64.mul
    f64.add
    local.set $6
    local.get $1
    i32.const 2
    i32.shl
    local.tee $8
    global.get $assembly/particles/colors
    i32.add
    i32.load
    local.set $9
    global.get $assembly/particles/rockets
    local.get $8
    i32.add
    i32.load
    local.set $8
    global.get $assembly/particles/lifes
    local.get $7
    i32.add
    f64.load
    f64.const -0.016666666666666666
    f64.add
    local.tee $10
    f64.const 0
    f64.gt
    if
     local.get $5
     f64.const 0
     f64.lt
     local.get $5
     global.get $assembly/particles/width
     f64.convert_i32_s
     f64.ge
     i32.or
     local.get $6
     f64.const 0
     f64.lt
     i32.or
     local.get $6
     global.get $assembly/particles/height
     f64.convert_i32_s
     f64.ge
     i32.or
     i32.eqz
     if
      local.get $9
      i32.const 255
      i32.and
      f64.convert_i32_u
      local.get $8
      i32.const 1
      i32.eq
      if (result f64)
       f64.const 1
      else
       local.get $10
       f64.const 1
       local.get $10
       f64.const 1
       f64.lt
       select
       global.get $assembly/particles/intensity
       f64.mul
      end
      local.tee $11
      f64.mul
      i32.trunc_sat_f64_u
      global.get $assembly/particles/frame
      local.get $5
      i32.trunc_sat_f64_s
      global.get $assembly/particles/width
      local.get $6
      i32.trunc_sat_f64_s
      i32.mul
      i32.add
      i32.const 2
      i32.shl
      i32.add
      local.tee $12
      i32.load
      local.tee $7
      i32.const 255
      i32.and
      i32.add
      local.set $13
      local.get $12
      i32.const 255
      local.get $9
      i32.const 16
      i32.shr_u
      i32.const 255
      i32.and
      f64.convert_i32_u
      local.get $11
      f64.mul
      i32.trunc_sat_f64_u
      local.get $7
      i32.const 16
      i32.shr_u
      i32.const 255
      i32.and
      i32.add
      local.tee $12
      local.get $12
      i32.const 255
      i32.gt_u
      select
      i32.const 16
      i32.shl
      i32.const -16777216
      i32.or
      i32.const 255
      local.get $9
      i32.const 8
      i32.shr_u
      i32.const 255
      i32.and
      f64.convert_i32_u
      local.get $11
      f64.mul
      i32.trunc_sat_f64_u
      local.get $7
      i32.const 8
      i32.shr_u
      i32.const 255
      i32.and
      i32.add
      local.tee $7
      local.get $7
      i32.const 255
      i32.gt_u
      select
      i32.const 8
      i32.shl
      i32.or
      i32.const 255
      local.get $13
      local.get $13
      i32.const 255
      i32.gt_u
      select
      i32.or
      i32.store
     end
     local.get $2
     i32.const 3
     i32.shl
     local.tee $7
     global.get $assembly/particles/xs
     i32.add
     local.get $5
     f64.store
     global.get $assembly/particles/ys
     local.get $7
     i32.add
     local.get $6
     f64.store
     global.get $assembly/particles/vxs
     local.get $7
     i32.add
     local.get $3
     f64.store
     global.get $assembly/particles/vys
     local.get $7
     i32.add
     local.get $4
     f64.store
     global.get $assembly/particles/lifes
     local.get $7
     i32.add
     local.get $10
     f64.store
     local.get $2
     i32.const 2
     i32.shl
     local.tee $7
     global.get $assembly/particles/colors
     i32.add
     local.get $9
     i32.store
     global.get $assembly/particles/rockets
     local.get $7
     i32.add
     local.get $8
     i32.store
     local.get $2
     i32.const 1
     i32.add
     local.set $2
    else
     local.get $8
     i32.const 1
     i32.eq
     local.get $0
     i32.const 1024
     i32.lt_s
     i32.and
     if
      local.get $0
      i32.const 3
      i32.shl
      local.tee $7
      global.get $assembly/particles/explX
      i32.add
      local.get $5
      f64.store
      global.get $assembly/particles/explY
      local.get $7
      i32.add
      local.get $6
      f64.store
      global.get $assembly/particles/explC
      local.get $0
      i32.const 2
      i32.shl
      i32.add
      local.get $9
      i32.store
      local.get $0
      i32.const 1
      i32.add
      local.set $0
     end
    end
    local.get $1
    i32.const 1
    i32.add
    local.set $1
    br $for-loop|2
   end
  end
  local.get $2
  global.set $assembly/particles/count
  i32.const 0
  local.set $2
  loop $for-loop|3
   local.get $0
   local.get $2
   i32.gt_s
   if
    i32.const 0
    local.set $1
    loop $for-loop|4
     local.get $1
     i32.const 400
     i32.lt_s
     global.get $assembly/particles/count
     global.get $assembly/particles/capacity
     i32.lt_s
     i32.and
     if
      loop $do-loop|5
       global.get $assembly/particles/seed
       local.tee $7
       local.get $7
       i32.const 13
       i32.shl
       i32.xor
       local.tee $7
       local.get $7
       i32.const 17
       i32.shr_u
       i32.xor
       local.tee $7
       local.get $7
       i32.const 5
       i32.shl
       i32.xor
       local.tee $7
       global.set $assembly/particles/seed
       global.get $assembly/particles/seed
       local.tee $8
       local.get $8
       i32.const 13
       i32.shl
       i32.xor
       local.tee $8
       local.get $8
       i32.const 17
       i32.shr_u
       i32.xor
       local.tee $8
       local.get $8
       i32.const 5
       i32.shl
       i32.xor
       local.tee $8
       global.set $assembly/particles/seed
       local.get $7
       f64.convert_i32_u
       f64.const 2.3283064365386963e-10
       f64.mul
       f64.const 2
       f64.mul
       f64.const -1
       f64.add
       local.tee $3
       local.get $3
       f64.mul
       local.get $8
       f64.convert_i32_u
       f64.const 2.3283064365386963e-10
       f64.mul
       f64.const 2
       f64.mul
       f64.const -1
       f64.add
       local.tee $4
       local.get $4
       f64.mul
       f64.add
       f64.const 1
       f64.gt
       br_if $do-loop|5
      end
      global.get $assembly/particles/count
      local.tee $7
      i32.const 1
      i32.add
      global.set $assembly/particles/count
      local.get $7
      i32.const 3
      i32.shl
      local.tee $8
      global.get $assembly/particles/xs
      i32.add
      local.get $2
      i32.const 3
      i32.shl
      local.tee $9
      global.get $assembly/particles/explX
      i32.add
      f64.load
      f64.store
      global.get $assembly/particles/ys
      local.get $8
      i32.add
      global.get $assembly/particles/explY
      local.get $9
      i32.add
      f64.load
      f64.store
      global.get $assembly/particles/vxs
      local.get $8
      i32.add
      local.get $3
      f64.const 150
      f64.mul
      f64.store
      global.get $assembly/particles/vys
      local.get $8
      i32.add
      local.get $4
      f64.const 150
      f64.mul
      f64.store
      global.get $assembly/particles/seed
      local.tee $9
      local.get $9
      i32.const 13
      i32.shl
      i32.xor
      local.tee $9
      local.get $9
      i32.const 17
      i32.shr_u
      i32.xor
      local.tee $9
      local.get $9
      i32.const 5
      i32.shl
      i32.xor
      local.tee $9
      global.set $assembly/particles/seed
      global.get $assembly/particles/lifes
      local.get $8
      i32.add
      local.get $9
      f64.convert_i32_u
      f64.const 2.3283064365386963e-10
      f64.mul
      f64.const 1
      f64.add
      f64.store
      local.get $7
      i32.const 2
      i32.shl
      local.tee $7
      global.get $assembly/particles/colors
      i32.add
      global.get $assembly/particles/explC
      local.get $2
      i32.const 2
      i32.shl
      i32.add
      i32.load
      i32.store
      global.get $assembly/particles/rockets
      local.get $7
      i32.add
      i32.const 0
      i32.store
      local.get $1
      i32.const 1
      i32.add
      local.set $1
      br $for-loop|4
     end
    end
    local.get $2
    i32.const 1
    i32.add
    local.set $2
    br $for-loop|3
   end
  end
 )
 (func $assembly/particles/particleCount (result i32)
  global.get $assembly/particles/count
 )
 (func $assembly/particles/init (param $0 i32) (param $1 i32) (param $2 i32) (param $3 i32) (result i32)
  (local $4 f64)
  local.get $0
  global.set $assembly/particles/width
  local.get $1
  global.set $assembly/particles/height
  local.get $2
  i32.const 1
  i32.shl
  global.set $assembly/particles/capacity
  i32.const 0
  global.set $assembly/particles/count
  local.get $3
  global.set $assembly/particles/seed
  f64.const 0
  global.set $assembly/particles/rocketAcc
  local.get $2
  f64.convert_i32_s
  local.tee $4
  f64.const 600
  f64.div
  f64.const 0.016666666666666666
  f64.mul
  global.set $assembly/particles/rocketsPerStep
  f64.const 3e4
  local.get $4
  f64.div
  global.set $assembly/particles/intensity
  global.get $assembly/particles/intensity
  f64.const 1
  f64.gt
  if
   f64.const 1
   global.set $assembly/particles/intensity
  end
  global.get $assembly/particles/capacity
  global.get $assembly/particles/allocated
  i32.gt_s
  if
   global.get $assembly/particles/capacity
   i32.const 3
   i32.shl
   call $~lib/rt/stub/__alloc
   global.set $assembly/particles/xs
   global.get $assembly/particles/capacity
   i32.const 3
   i32.shl
   call $~lib/rt/stub/__alloc
   global.set $assembly/particles/ys
   global.get $assembly/particles/capacity
   i32.const 3
   i32.shl
   call $~lib/rt/stub/__alloc
   global.set $assembly/particles/vxs
   global.get $assembly/particles/capacity
   i32.const 3
   i32.shl
   call $~lib/rt/stub/__alloc
   global.set $assembly/particles/vys
   global.get $assembly/particles/capacity
   i32.const 3
   i32.shl
   call $~lib/rt/stub/__alloc
   global.set $assembly/particles/lifes
   global.get $assembly/particles/capacity
   i32.const 2
   i32.shl
   call $~lib/rt/stub/__alloc
   global.set $assembly/particles/colors
   global.get $assembly/particles/capacity
   i32.const 2
   i32.shl
   call $~lib/rt/stub/__alloc
   global.set $assembly/particles/rockets
   global.get $assembly/particles/capacity
   global.set $assembly/particles/allocated
  end
  global.get $assembly/particles/explX
  i32.eqz
  if
   i32.const 8192
   call $~lib/rt/stub/__alloc
   global.set $assembly/particles/explX
   i32.const 8192
   call $~lib/rt/stub/__alloc
   global.set $assembly/particles/explY
   i32.const 4096
   call $~lib/rt/stub/__alloc
   global.set $assembly/particles/explC
  end
  local.get $0
  local.get $1
  i32.mul
  local.tee $2
  global.get $assembly/particles/allocatedFrame
  i32.gt_s
  if
   local.get $2
   i32.const 2
   i32.shl
   call $~lib/rt/stub/__alloc
   global.set $assembly/particles/frame
   local.get $2
   global.set $assembly/particles/allocatedFrame
  end
  global.get $assembly/particles/frame
  i32.const 0
  local.get $0
  local.get $1
  i32.mul
  i32.const 2
  i32.shl
  memory.fill
  global.get $assembly/particles/frame
 )
)
