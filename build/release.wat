(module
 (type $0 (func))
 (type $1 (func (param i32 i32 i32 i32)))
 (type $2 (func (param i32 i32 i32 f64 f64 f64)))
 (type $3 (func (param i32 i32) (result i32)))
 (import "env" "abort" (func $~lib/builtins/abort (param i32 i32 i32 i32)))
 (global $assembly/index/buffer (mut i32) (i32.const 0))
 (global $assembly/index/capacity (mut i32) (i32.const 0))
 (global $~lib/rt/stub/offset (mut i32) (i32.const 0))
 (memory $0 1)
 (data $0 (i32.const 1036) "<")
 (data $0.1 (i32.const 1048) "\02\00\00\00(\00\00\00A\00l\00l\00o\00c\00a\00t\00i\00o\00n\00 \00t\00o\00o\00 \00l\00a\00r\00g\00e")
 (data $1 (i32.const 1100) "<")
 (data $1.1 (i32.const 1112) "\02\00\00\00\1e\00\00\00~\00l\00i\00b\00/\00r\00t\00/\00s\00t\00u\00b\00.\00t\00s")
 (export "allocBuffer" (func $assembly/index/allocBuffer))
 (export "mandelbrot" (func $assembly/index/mandelbrot))
 (export "memory" (memory $0))
 (start $~start)
 (func $~start
  i32.const 1164
  global.set $~lib/rt/stub/offset
 )
 (func $assembly/index/mandelbrot (param $0 i32) (param $1 i32) (param $2 i32) (param $3 f64) (param $4 f64) (param $5 f64)
  (local $6 f64)
  (local $7 i32)
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
  f64.const 3
  local.get $1
  f64.convert_i32_s
  local.tee $6
  local.get $5
  f64.mul
  f64.div
  local.set $11
  local.get $0
  f64.convert_i32_s
  f64.const 0.5
  f64.mul
  local.set $12
  local.get $6
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
      local.set $6
      i32.const 0
      local.set $7
      loop $while-continue|2
       local.get $2
       local.get $7
       i32.gt_s
       local.get $5
       local.get $5
       f64.mul
       local.tee $16
       local.get $6
       local.get $6
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
        local.get $6
        f64.mul
        local.get $14
        f64.add
        local.set $6
        local.get $16
        local.get $17
        f64.sub
        local.get $15
        f64.add
        local.set $5
        local.get $7
        i32.const 1
        i32.add
        local.set $7
        br $while-continue|2
       end
      end
      local.get $9
      local.get $2
      local.get $7
      i32.le_s
      if (result i32)
       i32.const -16777216
      else
       f64.const 1
       local.get $7
       f64.convert_i32_s
       local.get $2
       f64.convert_i32_s
       f64.div
       f64.sqrt
       local.tee $5
       f64.sub
       local.tee $6
       f64.const 9
       f64.mul
       local.get $5
       f64.mul
       local.get $5
       f64.mul
       local.get $5
       f64.mul
       f64.const 255
       f64.mul
       i32.trunc_sat_f64_u
       local.get $6
       f64.const 8.5
       f64.mul
       local.get $6
       f64.mul
       local.get $6
       f64.mul
       local.get $5
       f64.mul
       f64.const 255
       f64.mul
       i32.trunc_sat_f64_u
       i32.const 16
       i32.shl
       i32.const -16777216
       i32.or
       local.get $6
       f64.const 15
       f64.mul
       local.get $6
       f64.mul
       local.get $5
       f64.mul
       local.get $5
       f64.mul
       f64.const 255
       f64.mul
       i32.trunc_sat_f64_u
       i32.const 8
       i32.shl
       i32.or
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
    i32.const 1056
    i32.const 1120
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
