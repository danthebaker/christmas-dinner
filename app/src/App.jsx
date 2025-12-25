import { useState, useEffect, useMemo } from 'react'
import './App.css'

// Recipe data - all items will be cooked
// Distributed across equipment for optimal timing
// EQUIPMENT:
// 1. Main Oven - standard fan oven
// 2. Ninja Foodi TenderCrisp - PRESSURE cook or AIR CRISP (one at a time)
// 3. Ninja 2-Drawer Smart Cook - 2 independent air fryer drawers
// 4. Hob - multiple burners

const RECIPES = [
  // MEATS
  {
    id: 'pork',
    name: 'Pork Shoulder',
    subtitle: '1.415kg - Pressure Cook',
    cookTime: 60,
    restTime: 15,
    prepTime: 15,
    equipment: 'ninja-tc',
    setting: 'PRESSURE → HIGH → 60 mins',
    color: '#8b3a42',
    instructions: [
      'Take pork out of fridge 30 mins before cooking',
      'Score the skin at 1cm intervals with Stanley knife (just skin, not meat)',
      'Season well with salt & pepper, rub into scored skin',
      'Add 250ml stock/water to TenderCrisp pot',
      'Place pork on trivet/rack in the pot (skin side up)',
      'Add roughly chopped onion, garlic, thyme/rosemary to liquid',
      'TENDERCRISP: PRESSURE, HIGH, 60 mins',
      'Natural release for 10 mins, then quick release',
      'Remove pork, pat skin dry with kitchen paper',
      'For crispy crackling: AIR CRISP at 200°C for 10-15 mins (watch carefully!)',
      'Rest for 15 mins while you make gravy from the cooking liquid'
    ]
  },
  {
    id: 'lamb-shoulder',
    name: 'Lamb Shoulder',
    subtitle: '0.97kg - Slow Roast (Tender)',
    cookTime: 127,
    restTime: 60,  // Rests while beef/lamb leg cook
    prepTime: 30,
    equipment: 'oven-middle',
    setting: '160°C fan - slow roast',
    cookFirst: true,  // Cooks before everything else at 160°C
    needsLowerTemp: true,  // Flag to indicate this uses 160°C
    color: '#6b4423',
    instructions: [
      'Take lamb shoulder out of fridge 30 mins before cooking',
      'Preheat oven to 160°C fan for slow roasting',
      'Roughly chop 1 onion, 1 carrot, 1 celery stick, half bulb garlic',
      'Pile veg, garlic and herbs (rosemary/thyme) into roasting tray',
      'Drizzle lamb with olive oil, season well with salt & pepper',
      'Place lamb on top of the vegetable trivet',
      'Cover tightly with foil for first 1.5 hours',
      'Remove foil for last 30 mins to brown',
      'Cook for 2hr 7 mins total until falling apart tender',
      'Transfer to board, wrap tightly in foil + tea towels',
      'Rest while beef & lamb leg cook - stays warm wrapped up'
    ]
  },
  {
    id: 'lamb-leg',
    name: 'Lamb Half Leg',
    subtitle: '1.03kg - Medium-Rare',
    cookTime: 50,
    restTime: 20,
    prepTime: 20,
    equipment: 'oven-bottom',
    setting: '230°C then 180°C fan',
    syncWithMainMeats: true,  // Goes in at same time as beef & yorkshires at 230°C
    color: '#8b5a3c',
    instructions: [
      'Take lamb leg out of fridge 30 mins before cooking',
      'Make small incisions and insert garlic slivers and rosemary',
      'Drizzle with olive oil, season well with salt & pepper',
      'Place on roasting tray with halved onion underneath',
      'Goes in AT SAME TIME as beef and yorkshires at 230°C',
      'After 25 mins (when yorkshires come out), oven reduces to 180°C',
      'Continue cooking for remaining 25 mins at 180°C',
      'For medium-rare, internal temp should reach 55-57°C',
      'Remove when 5°C below target (will rise during rest)',
      'Transfer to board, cover with foil and tea towel',
      'Rest for 20 mins - essential for pink, juicy meat'
    ]
  },
  {
    id: 'beef',
    name: 'Beef (2 Joints)',
    subtitle: 'Silverside 1.11kg + 1.05kg - Medium-Rare',
    cookTime: 55,
    restTime: 30,
    prepTime: 30,
    equipment: 'oven-top',
    setting: '230°C then 180°C fan',
    syncWithMainMeats: true,  // Goes in at same time as lamb leg & yorkshires at 230°C
    color: '#722f37',
    instructions: [
      'Take BOTH beef joints out of fridge 30 mins before cooking',
      'Roughly chop 1 onion, 1 carrot, 1 celery stick - no need to peel',
      'Pile veg and herbs (thyme/rosemary/bay) into LARGE roasting tray',
      'Drizzle BOTH beef joints with olive oil, season well with salt & pepper',
      'Place both joints on vegetable trivet (they share the same tray)',
      'Goes in AT SAME TIME as lamb leg and yorkshires at 230°C',
      'After 25 mins (when yorkshires come out), oven reduces to 180°C',
      'Continue cooking for remaining 30 mins at 180°C',
      'For medium-rare, internal temp should reach 52-55°C',
      'Remove when 5°C below target (temp rises during rest)',
      'Transfer both to board, cover with foil and tea towel',
      'Rest for 30 mins - essential for juicy medium-rare beef'
    ]
  },
  {
    id: 'wellington',
    name: 'Festive Wellington',
    subtitle: 'Vegetarian - 480g',
    cookTime: 55,
    restTime: 5,
    prepTime: 5,
    equipment: 'oven-middle',
    setting: '180°C fan, 50-55 mins',
    color: '#4a7c6a',
    instructions: [
      'Cook from frozen - do not thaw',
      'Place on lined baking tray',
      'OVEN MIDDLE: 180°C fan, 50-55 mins (goes in with meats)',
      'Rest 5 mins before slicing'
    ]
  },
  // SIDES
  {
    id: 'roast-veg',
    name: 'Roast Potatoes, Carrots & Parsnips',
    subtitle: 'All roasted together',
    cookTime: 45,
    prepTime: 20,
    equipment: 'drawer-1',
    setting: '200°C, 45 mins (air fry)',
    color: '#996600',
    instructions: [
      'Peel potatoes and halve any larger ones lengthways',
      'Peel carrots and parsnips, halve lengthways',
      'Parboil all veg together for 5 mins, drain well',
      'Shake colander to "chuff up" potato edges - this gives crispy bits!',
      'Toss with olive oil, honey, thyme, garlic, salt & pepper',
      'Split between BOTH drawers for even cooking',
      'SMART COOK: Both drawers at 200°C, 45 mins',
      'Shake drawers halfway through',
      'Cook until golden and crispy'
    ]
  },
  {
    id: 'roast-veg-2',
    name: 'Roast Veg (Drawer 2)',
    subtitle: 'Second batch in drawer 2',
    cookTime: 45,
    prepTime: 0,
    equipment: 'drawer-2',
    setting: '200°C, 45 mins (air fry)',
    color: '#996600',
    syncWith: 'roast-veg',
    instructions: [
      'Second half of roast veg in Drawer 2',
      'Cooks at same time as Drawer 1'
    ]
  },
  {
    id: 'boiled-carrots',
    name: 'Boiled Carrots',
    subtitle: 'Buttered',
    cookTime: 15,
    prepTime: 5,
    equipment: 'hob-3',
    setting: 'Boil 12-15 mins',
    color: '#e67e22',
    instructions: [
      'Peel carrots and slice into rounds or batons',
      'RING 3: Boil in salted water for 12-15 mins until tender',
      'Drain, toss with butter and season'
    ]
  },
  {
    id: 'boiled-cauliflower',
    name: 'Boiled Cauliflower',
    subtitle: 'Florets',
    cookTime: 10,
    prepTime: 5,
    equipment: 'hob-3',
    setting: 'Boil 8-10 mins',
    color: '#f5f5dc',
    instructions: [
      'Cut cauliflower into florets',
      'RING 3: Boil in salted water for 8-10 mins until tender (can share pot with carrots)',
      'Drain well and season with butter, salt & pepper'
    ]
  },
  {
    id: 'stuffing',
    name: 'Sage & Onion Stuffing',
    subtitle: 'Morrisons',
    cookTime: 25,
    prepTime: 10,
    equipment: 'oven-top',
    setting: '190°C fan, 25 mins',
    color: '#9b7653',
    instructions: [
      'Add boiling water to mix',
      'Shape into balls when cool enough',
      'Place on lined baking tray',
      'OVEN TOP: 190°C fan, 25 mins until golden'
    ]
  },
  {
    id: 'yorkshire',
    name: 'Yorkshire Puddings',
    subtitle: 'Makes 24+ - Goes in with meats!',
    cookTime: 25,
    prepTime: 40,
    equipment: 'oven-middle',
    setting: '230°C - with beef/lamb',
    syncWithMainMeats: true,  // Goes in at same time as beef/lamb at 230°C
    color: '#8b5a2b',
    instructions: [
      'Whisk 6 eggs, 230g plain flour, pinch of salt, 570ml milk in a large bowl',
      '(This is double batch - makes 24 puddings using 2 x 12-hole tins)',
      'Pour batter into jug, REST FOR 30 MINS - this makes them lighter',
      'When oven hits 230°C (after lamb shoulder), add oil to tins',
      'Put both muffin trays in oven, heat for 5 mins until oil is smoking hot',
      'Open oven, quickly fill each hole with batter - work fast!',
      'Goes in AT SAME TIME as beef and lamb leg',
      'Slide back in, close door - DO NOT OPEN FOR 15 MINS!',
      'After 25 mins remove yorkshires, turn oven DOWN to 180°C for meats',
      'Set yorkshires aside - rewarm 5 mins at 200°C before serving',
      'PS: Don\'t wash tin, just wipe - improves puddings each time!'
    ]
  },
  {
    id: 'mashed-potatoes',
    name: 'Mashed Potatoes',
    subtitle: '1kg potatoes (peeled)',
    cookTime: 20,
    prepTime: 5,
    equipment: 'hob-1',
    setting: 'Large pan, boil 20 mins',
    color: '#8b7355',
    instructions: [
      'Drain potatoes, cube into chunks',
      'RING 1: Large pan, boil 15-20 mins',
      'Drain, add butter & milk',
      'Mash until smooth, season'
    ]
  },
  {
    id: 'broccoli',
    name: 'Broccoli',
    subtitle: 'Steamed',
    cookTime: 8,
    prepTime: 5,
    equipment: 'hob-2',
    setting: 'Steam/boil 6-8 mins',
    color: '#228b22',
    instructions: [
      'Cut into florets',
      'RING 2: Steam or boil 6-8 mins',
      'Drain, season with butter'
    ]
  },
  {
    id: 'cauliflower-cheese',
    name: 'Cauliflower Cheese',
    subtitle: 'Morrisons The Best 900g',
    cookTime: 30,
    prepTime: 2,
    equipment: 'oven-bottom',
    setting: '190°C fan for 30 mins',
    color: '#3d3226',
    instructions: [
      'Remove sleeve and film lid',
      'Pre-heat oven to 190°C/Fan 170°C/Gas 5',
      'Place on baking tray on bottom shelf',
      'OVEN BOTTOM: 190°C fan for 30 mins',
      'Allow to stand 5 mins before serving'
    ]
  },
  {
    id: 'pigs-blankets',
    name: 'Pigs in Blankets',
    subtitle: '20 pieces (2 packs)',
    cookTime: 25,
    prepTime: 2,
    equipment: 'oven-bottom',
    setting: '200°C fan, 25 mins',
    color: '#a0522d',
    instructions: [
      'Arrange on lined baking tray in single layer',
      'OVEN BOTTOM: 200°C fan, 25 mins',
      'Turn halfway through',
      'Cook until bacon is crispy and golden'
    ]
  },
  {
    id: 'gravy',
    name: 'Meat Gravy',
    subtitle: 'From meat juices',
    cookTime: 15,
    prepTime: 5,
    equipment: 'hob-4',
    setting: 'Hob, simmer 10 mins',
    color: '#5d4037',
    instructions: [
      'Your meat is resting and you have the roasting tray with veg trivet and juices',
      'Use a spoon to remove 90% of hot fat from tray (angle away from you)',
      'Put tray back on hob over high heat',
      'Add 1 heaped dessertspoon plain flour, stir around',
      'Use potato masher to mash veg to a pulp - don\'t worry if lumpy',
      'Add a wineglass of red wine, white wine, cider, port or sherry',
      'Let alcohol cook off (gives fragrance)',
      'Add 1 litre hot stock (vegetable, chicken or beef)',
      'Bring to boil, scraping all goodness from bottom of pan',
      'Reduce heat, simmer 10 mins until desired consistency',
      'Pour through sieve into jug, push through with ladle',
      'Add teaspoon of horseradish, mustard, redcurrant jelly, cranberry, mint or apple sauce to taste'
    ]
  },
  {
    id: 'veggie-gravy',
    name: 'Veggie Gravy',
    subtitle: 'Pre-made - heat up',
    cookTime: 5,
    prepTime: 2,
    equipment: 'hob-4',
    setting: 'Small pan, heat gently',
    color: '#8b6914',
    instructions: [
      'Pour into small saucepan',
      'RING 4 (small): Heat gently',
      'Simmer until hot'
    ]
  }
]

const EQUIPMENT = {
  'oven-top': { name: 'Oven Top', icon: '🔥', color: '#722f37' },
  'oven-middle': { name: 'Oven Middle', icon: '🔥', color: '#8b3a42' },
  'oven-bottom': { name: 'Oven Bottom', icon: '🔥', color: '#a04450' },
  'ninja-tc': { name: 'TenderCrisp', icon: '🥷', color: '#2d4a3e' }, // Pressure/Steam/Air Crisp/Grill/Bake
  'drawer-1': { name: 'Drawer 1', icon: '1️⃣', color: '#4a6fa5' }, // Smart Cook Zone 1
  'drawer-2': { name: 'Drawer 2', icon: '2️⃣', color: '#5a7fb5' }, // Smart Cook Zone 2
  'hob-1': { name: 'Ring 1', icon: '⚫', color: '#c9a227' }, // Large ring
  'hob-2': { name: 'Ring 2', icon: '⚫', color: '#d4a574' }, // Large ring
  'hob-3': { name: 'Ring 3', icon: '⚫', color: '#b8860b' }, // Large ring
  'hob-4': { name: 'Ring 4', icon: '⚪', color: '#daa520' }, // Small ring
  rest: { name: 'Resting', icon: '🧣', color: '#8b7355' }
}

function formatTime(minutes) {
  if (minutes === 0) return 'Now'
  const hrs = Math.floor(minutes / 60)
  const mins = minutes % 60
  if (hrs === 0) return `${mins}m`
  if (mins === 0) return `${hrs}h`
  return `${hrs}h ${mins}m`
}

function formatCountdown(totalSeconds) {
  if (totalSeconds <= 0) return '0:00'
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60
  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
  }
  return `${minutes}:${String(seconds).padStart(2, '0')}`
}

function formatClockTime(date) {
  return date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
}

function addMinutes(date, minutes) {
  return new Date(date.getTime() + minutes * 60000)
}

// Calculate pixel position for a time within the timeline
function getTimePosition(time, earliestTime, latestTime, height) {
  const totalDuration = latestTime - earliestTime
  const timeOffset = time - earliestTime
  return (timeOffset / totalDuration) * height
}

function RecipeModal({ recipe, equipment, scheduleTimes, currentTime, onClose }) {
  if (!recipe) return null

  const equipmentInfo = equipment[recipe.equipment]
  const times = scheduleTimes || {}

  // Calculate time for each instruction step based on content
  const getStepTime = (stepIndex) => {
    if (!times.prepStart || !times.cookStart) return null

    const step = recipe.instructions[stepIndex].toLowerCase()

    // Rest-related steps happen at cookEnd
    if (step.includes('rest') || step.includes('transfer to board') || step.includes('wrap') || step.includes('resting')) {
      return times.cookEnd
    }

    // "Remove" or "take out" during cooking means end of cooking
    if ((step.includes('remove') || step.includes('take out')) && stepIndex > 2) {
      return times.cookEnd
    }

    // Steps mentioning cooking settings or putting in oven happen at cookStart
    if (step.includes('oven') || step.includes('pressure') || step.includes('tendercrisp') ||
        step.includes('air crisp') || step.includes('°c') || step.includes('ring ') ||
        step.includes('boil') || step.includes('simmer') || step.includes('drawer')) {
      return times.cookStart
    }

    // Everything else is prep - distribute across prep time
    const prepSteps = recipe.instructions.filter((s, i) => {
      const lower = s.toLowerCase()
      return i <= stepIndex &&
        !lower.includes('oven') && !lower.includes('pressure') && !lower.includes('°c') &&
        !lower.includes('rest') && !lower.includes('transfer to board') &&
        !lower.includes('ring ') && !lower.includes('boil') && !lower.includes('drawer')
    }).length

    const totalPrepSteps = recipe.instructions.filter(s => {
      const lower = s.toLowerCase()
      return !lower.includes('oven') && !lower.includes('pressure') && !lower.includes('°c') &&
        !lower.includes('rest') && !lower.includes('transfer to board') &&
        !lower.includes('ring ') && !lower.includes('boil') && !lower.includes('drawer')
    }).length

    if (totalPrepSteps > 0 && prepSteps > 0) {
      const prepMinutes = recipe.prepTime || 0
      const minutesPerPrepStep = prepMinutes / totalPrepSteps
      const stepOffset = (prepSteps - 1) * minutesPerPrepStep
      return addMinutes(times.prepStart, stepOffset)
    }

    return times.prepStart
  }

  // Get countdown for a step time
  const getCountdown = (stepTime) => {
    if (!stepTime || !currentTime) return null
    const diffMs = stepTime - currentTime
    if (diffMs < 0) return 'done'
    const diffSeconds = Math.floor(diffMs / 1000)
    return formatCountdown(diffSeconds)
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>&times;</button>
        <div className="modal-header" style={{ borderColor: recipe.color }}>
          <span className="modal-icon">{equipmentInfo?.icon}</span>
          <div>
            <h2>{recipe.name}</h2>
            <p className="modal-subtitle">{recipe.subtitle}</p>
          </div>
        </div>
        <div className="modal-body">
          <div className="modal-info-row">
            {times.prepStart && (
              <div className="modal-info-item">
                <span className="modal-info-label">Prep At</span>
                <span className="modal-info-value modal-info-time">{formatClockTime(times.prepStart)}</span>
              </div>
            )}
            <div className="modal-info-item">
              <span className="modal-info-label">Cook At</span>
              <span className="modal-info-value modal-info-time">{times.cookStart ? formatClockTime(times.cookStart) : `${recipe.cookTime} mins`}</span>
            </div>
            {times.cookEnd && (
              <div className="modal-info-item">
                <span className="modal-info-label">Done At</span>
                <span className="modal-info-value modal-info-time">{formatClockTime(times.cookEnd)}</span>
              </div>
            )}
            {recipe.restTime && times.restEnd && (
              <div className="modal-info-item">
                <span className="modal-info-label">Rest Until</span>
                <span className="modal-info-value modal-info-time">{formatClockTime(times.restEnd)}</span>
              </div>
            )}
          </div>
          <div className="modal-info-row">
            <div className="modal-info-item">
              <span className="modal-info-label">Equipment</span>
              <span className="modal-info-value">{equipmentInfo?.name}</span>
            </div>
            <div className="modal-info-item">
              <span className="modal-info-label">Cook Time</span>
              <span className="modal-info-value">{recipe.cookTime} mins</span>
            </div>
            {recipe.restTime && (
              <div className="modal-info-item">
                <span className="modal-info-label">Rest Time</span>
                <span className="modal-info-value">{recipe.restTime} mins</span>
              </div>
            )}
          </div>
          <div className="modal-setting">
            <span className="modal-setting-label">Setting</span>
            <span className="modal-setting-value">{recipe.setting}</span>
          </div>
          <div className="modal-instructions">
            <h3>Instructions</h3>
            <ol>
              {recipe.instructions.map((step, i) => {
                const stepTime = getStepTime(i)
                const countdown = getCountdown(stepTime)
                const isDone = countdown === 'done'
                return (
                  <li key={i} className={isDone ? 'step-done' : ''}>
                    <div className="step-content">
                      <span className="step-text">{step}</span>
                      {stepTime && (
                        <div className="step-timing">
                          <span className="step-time">{formatClockTime(stepTime)}</span>
                          {countdown && !isDone && (
                            <span className="step-countdown">{countdown}</span>
                          )}
                          {isDone && <span className="step-done-badge">✓</span>}
                        </div>
                      )}
                    </div>
                  </li>
                )
              })}
            </ol>
          </div>
        </div>
      </div>
    </div>
  )
}

// Check if two time ranges overlap
function blocksOverlap(a, b) {
  return a.start < b.end && b.start < a.end
}

// Assign column indices to blocks that overlap
function assignColumns(blocks) {
  const sortedBlocks = [...blocks].sort((a, b) => a.start - b.start)

  // First, find all overlapping blocks for each block
  sortedBlocks.forEach(block => {
    block.overlappingBlocks = sortedBlocks.filter(other =>
      other !== block && blocksOverlap(block, other)
    )
  })

  // For each block, determine its column position among its overlapping group
  sortedBlocks.forEach(block => {
    if (block.overlappingBlocks.length === 0) {
      // No overlaps - full width
      block.columnIndex = 0
      block.totalColumns = 1
    } else {
      // Find all blocks in this overlap group (including self)
      const overlapGroup = [block, ...block.overlappingBlocks]
      // Sort by start time to assign consistent column positions
      overlapGroup.sort((a, b) => a.start - b.start || a.name.localeCompare(b.name))

      // Find how many columns needed for this specific overlap group
      const columns = []
      overlapGroup.forEach(b => {
        let colIdx = columns.findIndex(col =>
          !col.some(existing => blocksOverlap(existing, b))
        )
        if (colIdx === -1) {
          colIdx = columns.length
          columns.push([])
        }
        columns[colIdx].push(b)
        b.columnIndex = colIdx
      })

      // Set totalColumns for all blocks in this group
      overlapGroup.forEach(b => {
        b.totalColumns = columns.length
      })
    }
  })

  return sortedBlocks
}

function DeviceColumn({ device, deviceKey, blocks, earliestTime, latestTime, timelineHeight, currentTemp, currentTime, onBlockClick }) {
  // Assign columns to overlapping blocks
  const blocksWithColumns = assignColumns(blocks)

  return (
    <div className="device-column">
      <div className="device-header" style={{ borderColor: device.color }}>
        <span className="device-icon">{device.icon}</span>
        <span className="device-name">{device.name}</span>
        {currentTemp && <span className="device-temp">{currentTemp}°C</span>}
      </div>
      <div className="device-timeline" style={{ height: timelineHeight }}>
        {blocksWithColumns.map((block, i) => {
          const top = getTimePosition(block.start, earliestTime, latestTime, timelineHeight)
          const bottom = getTimePosition(block.end, earliestTime, latestTime, timelineHeight)
          const height = bottom - top

          // Calculate horizontal position based on column
          const columnWidth = 100 / block.totalColumns
          const leftPercent = block.columnIndex * columnWidth
          const widthPercent = columnWidth

          // Calculate time remaining
          const now = currentTime
          const isActive = now >= block.start && now < block.end
          const isUpcoming = now < block.start
          const minutesRemaining = Math.ceil((block.end - now) / 60000)
          const minutesUntilStart = Math.ceil((block.start - now) / 60000)

          return (
            <div
              key={i}
              className={`timeline-block ${block.type} ${block.recipe ? 'clickable' : ''} ${block.totalColumns > 1 ? 'has-overlap' : ''} ${isActive ? 'is-active' : ''}`}
              style={{
                top: `${top}px`,
                height: `${Math.max(height, 30)}px`,
                backgroundColor: block.color,
                borderColor: block.color,
                left: block.totalColumns > 1 ? `calc(4px + ${leftPercent}%)` : '4px',
                right: block.totalColumns > 1 ? `calc(4px + ${100 - leftPercent - widthPercent}%)` : '4px',
                width: block.totalColumns > 1 ? `calc(${widthPercent}% - 6px)` : 'auto'
              }}
              onClick={() => block.recipe && onBlockClick(block.recipe)}
            >
              <div className="block-content">
                <span className="block-name">{block.name}</span>
                <span className="block-time">{formatClockTime(block.start)} - {formatClockTime(block.end)}</span>
                {block.setting && <span className="block-setting">{block.setting}</span>}
                {isActive && (
                  <span className="block-remaining">{minutesRemaining} min left</span>
                )}
                {isUpcoming && minutesUntilStart <= 60 && (
                  <span className="block-upcoming">in {minutesUntilStart} min</span>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function TimeRuler({ earliestTime, latestTime, timelineHeight, currentTime }) {
  const timeMarkers = []
  let current = new Date(earliestTime)
  // Round to nearest 30 mins
  current.setMinutes(Math.floor(current.getMinutes() / 30) * 30, 0, 0)

  while (current <= latestTime) {
    const pos = getTimePosition(current, earliestTime, latestTime, timelineHeight)
    if (pos >= 0 && pos <= timelineHeight) {
      timeMarkers.push({
        time: new Date(current),
        position: pos
      })
    }
    current = addMinutes(current, 30)
  }

  // Calculate current time position
  const currentTimePos = getTimePosition(currentTime, earliestTime, latestTime, timelineHeight)
  const showCurrentTime = currentTimePos >= 0 && currentTimePos <= timelineHeight

  return (
    <div className="time-ruler" style={{ height: timelineHeight }}>
      {timeMarkers.map((marker, i) => (
        <div
          key={i}
          className="time-marker"
          style={{ top: `${marker.position}px` }}
        >
          <span className="marker-time">{formatClockTime(marker.time)}</span>
          <div className="marker-line"></div>
        </div>
      ))}
      {showCurrentTime && (
        <div className="current-time-marker" style={{ top: `${currentTimePos}px` }}>
          <span className="current-time-label">NOW</span>
          <div className="current-time-line"></div>
        </div>
      )}
    </div>
  )
}

function PrepList({ checklistEvents }) {
  const getEventIcon = (type) => {
    switch (type) {
      case 'preheat': return '🔥'
      case 'prep': return '🔪'
      case 'cook': return '👨‍🍳'
      case 'rest': return '🧣'
      case 'serve': return '🍽️'
      default: return '📋'
    }
  }

  return (
    <div className="prep-list">
      <h3>Full Checklist</h3>
      <div className="prep-items">
        {checklistEvents.map((event, i) => (
          <div key={i} className={`prep-item prep-item-${event.type}`}>
            <span className="prep-time">{formatClockTime(event.time)}</span>
            <span className="prep-icon">{getEventIcon(event.type)}</span>
            <span className="prep-name">{event.name}</span>
            <span className="prep-desc">{event.description}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// Play jingle bells MP3 sound
let alarmAudio = null

function playAlarmSound() {
  try {
    // Stop any currently playing alarm
    if (alarmAudio) {
      alarmAudio.pause()
      alarmAudio.currentTime = 0
    }

    alarmAudio = new Audio('/jingle-bells.mp3')
    alarmAudio.volume = 1.0
    alarmAudio.play().catch(e => {
      console.log('Could not play alarm sound:', e)
    })
  } catch (e) {
    console.log('Could not play alarm sound:', e)
  }
}

// Send push notification via ntfy
const NTFY_TOPIC = 'christmas-dinner-dan'

function sendPushNotification(title, message, isUrgent = false) {
  fetch(`https://ntfy.sh/${NTFY_TOPIC}`, {
    method: 'POST',
    headers: {
      'Title': title,
      'Priority': isUrgent ? 'urgent' : 'high',
      'Tags': isUrgent ? 'warning,christmas_tree' : 'bell,christmas_tree'
    },
    body: message
  }).catch(e => {
    console.log('Could not send push notification:', e)
  })
}

function App() {
  const [servingTime, setServingTime] = useState(() => {
    const today = new Date()
    today.setHours(15, 0, 0, 0)
    return today
  })

  const [currentTime, setCurrentTime] = useState(new Date())
  const [alertsEnabled, setAlertsEnabled] = useState(() => {
    return localStorage.getItem('alertsEnabled') === 'true'
  })
  const [notifiedEvents, setNotifiedEvents] = useState(new Set())
  const [selectedRecipeId, setSelectedRecipeId] = useState(null)
  const [testNotificationIndex, setTestNotificationIndex] = useState(null)
  const [activeAlert, setActiveAlert] = useState(null) // For big on-screen alerts
  const [showCookingNow, setShowCookingNow] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)

  const selectedRecipe = selectedRecipeId ? RECIPES.find(r => r.id === selectedRecipeId) : null

  const enableAlerts = () => {
    setAlertsEnabled(true)
    localStorage.setItem('alertsEnabled', 'true')
    // Show confirmation alert
    setActiveAlert({
      title: '🎄 Alerts Enabled!',
      description: 'You\'ll be notified when each cooking step is due.',
      isNow: false
    })
    playAlarmSound()
    // Also try browser notifications as backup
    if ('Notification' in window && Notification.permission !== 'granted') {
      Notification.requestPermission()
    }
  }

  const disableAlerts = () => {
    setAlertsEnabled(false)
    localStorage.setItem('alertsEnabled', 'false')
  }

  const dismissAlert = () => {
    setActiveAlert(null)
    // Stop the alarm sound when dismissed
    if (alarmAudio) {
      alarmAudio.pause()
      alarmAudio.currentTime = 0
    }
  }

  // Listen for Enter key to dismiss alerts, Escape to exit fullscreen
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Enter' && activeAlert) {
        dismissAlert()
      }
      if (e.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [activeAlert, isFullscreen])

  const testNextNotification = (events) => {
    // First ensure alerts are enabled
    if (!alertsEnabled) {
      enableAlerts()
      return
    }

    // Now run through the events
    const nextIndex = testNotificationIndex === null ? 0 : testNotificationIndex + 1
    if (!events || nextIndex >= events.length) {
      setTestNotificationIndex(null)
      setActiveAlert({
        title: '🎄 Test Complete!',
        description: 'All notifications have been previewed.',
        isNow: false
      })
      playAlarmSound()
      return
    }

    const event = events[nextIndex]
    const testTitle = `TEST ${nextIndex + 1}/${events.length}: ${event.title}`
    const testBody = `${formatClockTime(event.time)} - ${event.description}`

    playAlarmSound() // Play jingle bells
    sendPushNotification(testTitle, testBody, false) // Send to phone

    setActiveAlert({
      title: testTitle,
      description: testBody,
      isNow: false
    })
    setTestNotificationIndex(nextIndex)
  }

  const stopTestNotifications = () => {
    setTestNotificationIndex(null)
  }

  // Build schedule for all devices
  const { deviceBlocks, checklistEvents, earliestTime, latestTime, allEvents, recipeTimes } = useMemo(() => {
    const blocks = {
      'oven-top': [],    // Main Oven - Top Shelf
      'oven-middle': [], // Main Oven - Middle Shelf
      'oven-bottom': [], // Main Oven - Bottom Shelf
      'ninja-tc': [],    // TenderCrisp (pressure + air crisp)
      'drawer-1': [],    // Smart Cook Drawer 1
      'drawer-2': [],    // Smart Cook Drawer 2
      'hob-1': [],       // Ring 1 (large)
      'hob-2': [],       // Ring 2 (large)
      'hob-3': [],       // Ring 3 (large)
      'hob-4': [],       // Ring 4 (small)
      rest: []
    }
    const checklist = []
    const events = []
    const recipeSchedule = {} // Track times for each recipe

    // Find items that need resting - they determine when meats must finish
    const meatsWithRest = RECIPES.filter(r => r.restTime && r.restTime > 0 && !r.cookFirst)
    const maxRestTime = Math.max(...meatsWithRest.map(r => r.restTime), 0)

    // Find the longest cooking item to determine earliest start
    const longestCookItem = RECIPES.reduce((longest, r) => {
      if (r.cookFirst) return longest
      const totalTime = r.cookTime + (r.restTime || 0) + r.prepTime
      const longestTime = longest ? longest.cookTime + (longest.restTime || 0) + longest.prepTime : 0
      return totalTime > longestTime ? r : longest
    }, null)

    // Track preheat times for equipment
    const preheatTimes = {}

    // First pass: calculate times for synced recipes
    const syncedTimes = {}
    RECIPES.filter(r => !r.syncWith).forEach(recipe => {
      const restTime = recipe.restTime || 0
      let cookEnd
      if (recipe.cookFirst) {
        const longestPrepStart = addMinutes(
          addMinutes(servingTime, -(longestCookItem.restTime || 0)),
          -(longestCookItem.cookTime + longestCookItem.prepTime)
        )
        cookEnd = addMinutes(longestPrepStart, -10)
      } else if (recipe.equipment.startsWith('hob-')) {
        cookEnd = servingTime
      } else {
        cookEnd = addMinutes(servingTime, -restTime)
      }
      syncedTimes[recipe.id] = { cookEnd }
    })

    // Calculate times for each recipe
    RECIPES.forEach(recipe => {
      const restTime = recipe.restTime || 0
      let cookEnd, cookStart, prepStart

      if (recipe.syncWith) {
        // Sync with another recipe - they finish at the same time
        const syncTarget = syncedTimes[recipe.syncWith]
        if (syncTarget) {
          cookEnd = syncTarget.cookEnd
          cookStart = addMinutes(cookEnd, -recipe.cookTime)
        } else {
          // Fallback if sync target not found
          cookEnd = addMinutes(servingTime, -restTime)
          cookStart = addMinutes(cookEnd, -recipe.cookTime)
        }
      } else if (recipe.cookFirst && recipe.needsLowerTemp) {
        // Lamb shoulder - cooks first at 160°C, before everything else
        // Work backwards from when beef needs to start
        const beefRestTime = 30
        const beefCookTime = 55

        const beefEnd = addMinutes(servingTime, -beefRestTime)
        const beefStart = addMinutes(beefEnd, -beefCookTime)
        // Lamb shoulder finishes 10 mins before beef starts (to heat oven to 230°C)
        cookEnd = addMinutes(beefStart, -10)
        cookStart = addMinutes(cookEnd, -recipe.cookTime)
      } else if (recipe.syncWithMainMeats) {
        // Beef, lamb leg, and yorkshires all go in together at 230°C
        // Beef is the anchor (55 min cook, 30 min rest)
        // Lamb leg: 50 min cook, 20 min rest (finishes 5 mins before beef)
        // Yorkshires: 25 min cook (come out when oven drops to 180°C)
        const beefRestTime = 30
        const beefCookTime = 55

        const beefEnd = addMinutes(servingTime, -beefRestTime)
        const beefStart = addMinutes(beefEnd, -beefCookTime)
        cookStart = beefStart
        cookEnd = addMinutes(cookStart, recipe.cookTime)
      } else if (recipe.cookFirst) {
        // Other cookFirst items - shouldn't be any now but keep for safety
        const longestPrepStart = addMinutes(
          addMinutes(servingTime, -(longestCookItem.restTime || 0)),
          -(longestCookItem.cookTime + longestCookItem.prepTime)
        )
        cookEnd = addMinutes(longestPrepStart, -10)
        cookStart = addMinutes(cookEnd, -recipe.cookTime)
      } else if (recipe.equipment.startsWith('hob-')) {
        // Hob items cook right before serving
        cookEnd = servingTime
        cookStart = addMinutes(cookEnd, -recipe.cookTime)
      } else if (recipe.finishEarlyBy) {
        // Items that need to finish earlier to free up equipment
        cookEnd = addMinutes(servingTime, -(restTime + recipe.finishEarlyBy))
        cookStart = addMinutes(cookEnd, -recipe.cookTime)
      } else {
        // Everything else finishes with time to rest
        cookEnd = addMinutes(servingTime, -restTime)
        cookStart = addMinutes(cookEnd, -recipe.cookTime)
      }

      prepStart = addMinutes(cookStart, -recipe.prepTime)

      // Store schedule times for this recipe
      recipeSchedule[recipe.id] = {
        prepStart,
        cookStart,
        cookEnd,
        restEnd: restTime > 0 ? addMinutes(cookEnd, restTime) : null
      }

      // Track preheat times needed for oven
      if (recipe.equipment.startsWith('oven-')) {
        const preheatTime = addMinutes(cookStart, -15) // 15 mins to preheat
        if (recipe.cookFirst && recipe.needsLowerTemp) {
          // Lamb shoulder needs 160°C preheat (goes first)
          if (!preheatTimes.ovenLow || preheatTime < preheatTimes.ovenLow) {
            preheatTimes.ovenLow = preheatTime
          }
        } else if (recipe.syncWithMainMeats) {
          // Beef, lamb leg & yorkshires need 230°C (after lamb shoulder)
          if (!preheatTimes.ovenHigh || preheatTime < preheatTimes.ovenHigh) {
            preheatTimes.ovenHigh = preheatTime
          }
        }
      }

      // Add prep event to checklist
      checklist.push({
        time: prepStart,
        type: 'prep',
        name: recipe.name,
        description: recipe.instructions[0],
        recipe: recipe.id
      })

      events.push({
        time: prepStart,
        type: 'prep',
        title: `Prep: ${recipe.name}`,
        description: recipe.instructions[0]
      })

      // Add "put in oven/cooker" event to checklist
      const equipmentName = EQUIPMENT[recipe.equipment]?.name || recipe.equipment
      checklist.push({
        time: cookStart,
        type: 'cook',
        name: `${recipe.name} → ${equipmentName}`,
        description: recipe.setting,
        recipe: recipe.id
      })

      // Add cooking block
      blocks[recipe.equipment].push({
        start: cookStart,
        end: cookEnd,
        name: recipe.name,
        type: 'cook',
        setting: recipe.setting,
        color: recipe.color,
        recipe: recipe.id
      })

      events.push({
        time: cookStart,
        type: 'cook',
        title: `Cook: ${recipe.name}`,
        description: recipe.setting,
        temp: recipe.setting
      })

      // Add resting event to checklist
      if (restTime > 0) {
        checklist.push({
          time: cookEnd,
          type: 'rest',
          name: `Rest ${recipe.name}`,
          description: 'Remove from oven, wrap in foil + tea towels',
          recipe: recipe.id
        })

        blocks.rest.push({
          start: cookEnd,
          end: addMinutes(cookEnd, restTime),
          name: recipe.name,
          type: 'rest',
          color: recipe.color + '88', // Semi-transparent
          recipe: recipe.id
        })

        events.push({
          time: cookEnd,
          type: 'rest',
          title: `Rest: ${recipe.name}`,
          description: `Wrap in foil + tea towels`
        })
      }
    })

    // Add oven preheat events to checklist
    if (preheatTimes.ovenLow) {
      checklist.push({
        time: preheatTimes.ovenLow,
        type: 'preheat',
        name: 'Preheat Oven (Lamb Shoulder)',
        description: '160°C fan for slow roasting'
      })
      events.push({
        time: preheatTimes.ovenLow,
        type: 'preheat',
        title: '🔥 Preheat Oven to 160°C',
        description: 'For lamb shoulder slow roast'
      })
    }
    if (preheatTimes.ovenHigh) {
      checklist.push({
        time: preheatTimes.ovenHigh,
        type: 'preheat',
        name: 'Crank Oven to 230°C',
        description: 'For beef, lamb leg & yorkshires together'
      })
      events.push({
        time: preheatTimes.ovenHigh,
        type: 'preheat',
        title: '🔥 Crank Oven to 230°C',
        description: 'Beef, lamb leg & yorkshires go in together'
      })
    }

    // Add yorkshire removal and temp reduction event
    const yorkshireRecipe = RECIPES.find(r => r.id === 'yorkshire')
    if (yorkshireRecipe && yorkshireRecipe.syncWithMainMeats) {
      // Calculate when yorkshires come out (25 mins after beef/lamb start)
      const beefRestTime = 30
      const beefCookTime = 55
      const beefEnd = addMinutes(servingTime, -beefRestTime)
      const beefStart = addMinutes(beefEnd, -beefCookTime)
      const yorkshireEnd = addMinutes(beefStart, yorkshireRecipe.cookTime)

      checklist.push({
        time: yorkshireEnd,
        type: 'preheat',
        name: 'Yorkshires Out → Reduce to 180°C',
        description: 'Remove yorkshires, turn oven DOWN to 180°C for remaining meat cooking'
      })
      events.push({
        time: yorkshireEnd,
        type: 'temp',
        title: '🔥 Reduce Oven to 180°C',
        description: 'Yorkshires out! Turn oven down for remaining meat cooking'
      })

      // Add rewarm yorkshires event before serving
      const rewarmTime = addMinutes(servingTime, -10) // 10 mins before serving
      const rewarmEnd = addMinutes(servingTime, -5) // Ready 5 mins before to plate up

      // Add visual block on oven-top for rewarming
      blocks['oven-top'].push({
        start: rewarmTime,
        end: rewarmEnd,
        name: 'Rewarm Yorkshires',
        type: 'cook',
        setting: '200°C, 5 mins',
        color: yorkshireRecipe.color,
        recipe: 'yorkshire'
      })

      checklist.push({
        time: rewarmTime,
        type: 'cook',
        name: 'Rewarm Yorkshire Puddings',
        description: 'Pop back in oven for 5 mins at 200°C'
      })
      events.push({
        time: rewarmTime,
        type: 'temp',
        title: '🔥 Rewarm Yorkshire Puddings',
        description: 'Pop Yorkshires back in oven for 5 mins at 200°C'
      })
    }

    // Add serving event
    checklist.push({
      time: servingTime,
      type: 'serve',
      name: 'SERVE!',
      description: 'Christmas Dinner is ready!'
    })
    events.push({
      time: servingTime,
      type: 'serve',
      title: '🍽️ SERVE!',
      description: 'Christmas Dinner is ready!'
    })

    // Sort checklist and events by time
    checklist.sort((a, b) => a.time - b.time)
    events.sort((a, b) => a.time - b.time)

    // Find timeline bounds
    let earliest = servingTime
    let latest = servingTime

    Object.values(blocks).forEach(deviceBlocks => {
      deviceBlocks.forEach(block => {
        if (block.start < earliest) earliest = block.start
        if (block.end > latest) latest = block.end
      })
    })

    // Add some padding
    earliest = addMinutes(earliest, -30)
    latest = addMinutes(latest, 15)

    return {
      deviceBlocks: blocks,
      checklistEvents: checklist,
      earliestTime: earliest,
      latestTime: latest,
      allEvents: events,
      recipeTimes: recipeSchedule
    }
  }, [servingTime])

  // Update time every second when actively cooking (past first event), otherwise every minute
  const [isActivelyCooking, setIsActivelyCooking] = useState(false)

  useEffect(() => {
    // Check if we're past the first event (cooking has started)
    const firstEventTime = checklistEvents[0]?.time
    const cooking = firstEventTime && currentTime >= firstEventTime
    setIsActivelyCooking(cooking)
  }, [checklistEvents, currentTime])

  useEffect(() => {
    const interval = (showCookingNow || isActivelyCooking) ? 1000 : 60000
    const timer = setInterval(() => setCurrentTime(new Date()), interval)
    return () => clearInterval(timer)
  }, [showCookingNow, isActivelyCooking])

  // Notifications
  useEffect(() => {
    if (!alertsEnabled) return

    const checkAlerts = () => {
      const now = new Date()
      allEvents.forEach(event => {
        const eventKey = `${event.time.getTime()}-${event.title}`
        const timeDiff = event.time - now

        if (timeDiff > -60000 && timeDiff <= 120000 && !notifiedEvents.has(eventKey)) {
          const isNow = timeDiff <= 0
          const alertTitle = isNow ? `NOW: ${event.title}` : `Coming up: ${event.title}`
          const alertBody = event.description + (event.temp ? ` (${event.temp})` : '')

          playAlarmSound() // Play jingle bells

          // Send push notification to phone via ntfy
          sendPushNotification(alertTitle, alertBody, isNow)

          // Show big in-app alert
          setActiveAlert({
            title: isNow ? `🚨 ${alertTitle}` : `⏰ ${alertTitle}`,
            description: alertBody,
            isNow: isNow
          })
          // Also try browser notification as backup
          if ('Notification' in window && Notification.permission === 'granted') {
            new Notification(isNow ? `🚨 ${alertTitle}` : `⏰ ${alertTitle}`, {
              body: alertBody,
              requireInteraction: true
            })
          }
          setNotifiedEvents(prev => new Set([...prev, eventKey]))
        }
      })
    }

    const timer = setInterval(checkAlerts, 30000)
    checkAlerts()
    return () => clearInterval(timer)
  }, [alertsEnabled, allEvents, notifiedEvents])

  const timelineHeight = 900

  // When in test mode, simulate the time as if the current notification is happening
  const displayTime = useMemo(() => {
    if (testNotificationIndex !== null && allEvents[testNotificationIndex]) {
      // Set simulated time to the event time
      return allEvents[testNotificationIndex].time
    }
    return currentTime
  }, [testNotificationIndex, allEvents, currentTime])

  // Find the next upcoming event (not in the past)
  const nextEvent = useMemo(() => {
    return checklistEvents.find(event => event.time > displayTime)
  }, [checklistEvents, displayTime])

  // Calculate time until next event (in seconds for live countdown)
  const secondsUntilNext = nextEvent ? Math.max(0, Math.floor((nextEvent.time - displayTime) / 1000)) : 0
  const timeUntilStart = checklistEvents[0] ? Math.round((checklistEvents[0].time - displayTime) / 60000) : 0

  const handleTimeChange = (e) => {
    const [hours, minutes] = e.target.value.split(':')
    const newTime = new Date(servingTime)
    newTime.setHours(parseInt(hours), parseInt(minutes))
    setServingTime(newTime)
  }

  // Calculate current oven temp based on schedule
  const getCurrentOvenTemp = () => {
    const now = displayTime
    // Check all oven shelves for current cooking items
    const allOvenBlocks = [
      ...(deviceBlocks['oven-top'] || []),
      ...(deviceBlocks['oven-middle'] || []),
      ...(deviceBlocks['oven-bottom'] || [])
    ]
    for (const block of allOvenBlocks) {
      if (now >= block.start && now <= block.end) {
        return block.temp
      }
    }
    return null
  }

  // Get all items currently cooking (uses displayTime for dry run support)
  const cookingNowItems = useMemo(() => {
    const now = displayTime
    const items = []

    Object.entries(deviceBlocks).forEach(([deviceKey, blocks]) => {
      blocks.forEach(block => {
        if (now >= block.start && now < block.end) {
          const totalSecondsRemaining = Math.max(0, Math.floor((block.end - now) / 1000))
          const minutesRemaining = Math.floor(totalSecondsRemaining / 60)
          const secondsRemaining = totalSecondsRemaining % 60
          items.push({
            ...block,
            deviceKey,
            deviceName: EQUIPMENT[deviceKey]?.name || deviceKey,
            deviceIcon: EQUIPMENT[deviceKey]?.icon || '🍳',
            minutesRemaining,
            secondsRemaining,
            totalSecondsRemaining
          })
        }
      })
    })

    // Sort by time remaining (least time first)
    items.sort((a, b) => a.totalSecondsRemaining - b.totalSecondsRemaining)
    return items
  }, [deviceBlocks, displayTime])

  return (
    <div className="app">
      <div className="background-decoration">
        <div className="bauble bauble-1"></div>
        <div className="bauble bauble-2"></div>
        <div className="bauble bauble-3"></div>
        <div className="star"></div>
      </div>

      <header className="header">
        <div className="header-content">
          <h1>Christmas Dinner</h1>
          <p className="subtitle">Timing Planner</p>
        </div>
      </header>

      <main className="main">
        <section className="serving-time-section">
          <div className="serving-time-card">
            <label className="serving-time-label">Serving at</label>
            <input
              type="time"
              value={`${String(servingTime.getHours()).padStart(2, '0')}:${String(servingTime.getMinutes()).padStart(2, '0')}`}
              onChange={handleTimeChange}
              className="time-input"
            />
            <div className="time-info">
              <span className="current-time">
                {testNotificationIndex !== null ? 'Simulated: ' : 'Now: '}
                {formatClockTime(displayTime)}
              </span>
              {timeUntilStart > 0 ? (
                <span className="time-until">Start in {formatTime(timeUntilStart)}</span>
              ) : nextEvent ? (
                <span className="time-until next-event">
                  <span className="next-label">Next:</span> {nextEvent.name}
                  <span className="next-countdown">{formatCountdown(secondsUntilNext)}</span>
                </span>
              ) : (
                <span className="time-until complete">All done!</span>
              )}
            </div>
            <div className="controls-row">
              <button
                className={`cooking-now-btn ${cookingNowItems.length > 0 ? 'has-items' : ''}`}
                onClick={() => setShowCookingNow(true)}
              >
                🍳 Cooking Now {cookingNowItems.length > 0 && <span className="cooking-count">{cookingNowItems.length}</span>}
              </button>
              <div className="alert-toggle">
                {alertsEnabled ? (
                  <button className="alerts-active" onClick={disableAlerts} title="Click to disable alerts">
                    <span className="bell-icon">🔔</span> Alerts ON
                  </button>
                ) : (
                  <button className="enable-alerts-btn" onClick={enableAlerts}>
                    🔔 Enable Alerts
                  </button>
                )}
              </div>
              <div className="dry-run">
                {testNotificationIndex !== null ? (
                  <div className="dry-run-controls">
                    <span className="dry-run-progress">Dry Run: {testNotificationIndex + 1}/{allEvents.length}</span>
                    <button className="dry-run-next-btn" onClick={() => testNextNotification(allEvents)}>
                      Next →
                    </button>
                    <button className="dry-run-stop-btn" onClick={stopTestNotifications}>
                      Stop
                    </button>
                  </div>
                ) : (
                  <button className="dry-run-btn" onClick={() => testNextNotification(allEvents)}>
                    🎬 Dry Run
                  </button>
                )}
              </div>
            </div>
          </div>
        </section>

        <section className={`timeline-section ${isFullscreen ? 'fullscreen' : ''}`}>
          <div className="timeline-header">
            <h2>Cooking Schedule</h2>
            <button
              className="fullscreen-btn"
              onClick={() => setIsFullscreen(!isFullscreen)}
              title={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
            >
              {isFullscreen ? '✕ Exit' : '⛶ Fullscreen'}
            </button>
          </div>
          {isFullscreen && (
            <div className="fullscreen-info">
              <span className="fullscreen-time">
                {testNotificationIndex !== null ? 'Simulated: ' : ''}
                {formatClockTime(displayTime)}
              </span>
              {timeUntilStart > 0 ? (
                <span className="fullscreen-until">Start in {formatTime(timeUntilStart)}</span>
              ) : nextEvent ? (
                <div className="fullscreen-next">
                  <span className="fullscreen-next-label">Next:</span>
                  <span className="fullscreen-next-name">{nextEvent.name}</span>
                  <span className="fullscreen-next-countdown">{formatCountdown(secondsUntilNext)}</span>
                </div>
              ) : (
                <span className="fullscreen-until complete">All done!</span>
              )}
              <button
                className={`fullscreen-cooking-btn ${cookingNowItems.length > 0 ? 'has-items' : ''}`}
                onClick={() => setShowCookingNow(true)}
              >
                🍳 {cookingNowItems.length > 0 ? cookingNowItems.length : 'None'} cooking
              </button>
            </div>
          )}
          <div className="timeline-container">
            <TimeRuler
              earliestTime={earliestTime}
              latestTime={latestTime}
              timelineHeight={isFullscreen ? window.innerHeight - 140 : timelineHeight}
              currentTime={displayTime}
            />
            <div className="timeline-scroll-area">
              <div className="device-columns">
                {Object.entries(EQUIPMENT).map(([key, device]) => (
                  <DeviceColumn
                    key={key}
                    device={device}
                    deviceKey={key}
                    blocks={deviceBlocks[key] || []}
                    earliestTime={earliestTime}
                    latestTime={latestTime}
                    timelineHeight={isFullscreen ? window.innerHeight - 140 : timelineHeight}
                    currentTemp={key.startsWith('oven-') ? getCurrentOvenTemp() : null}
                    currentTime={displayTime}
                    onBlockClick={setSelectedRecipeId}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="prep-section">
          <PrepList checklistEvents={checklistEvents} />
        </section>

        <section className="menu-section">
          <h2>Full Menu</h2>
          <div className="menu-grid">
            {RECIPES.map(recipe => (
              <div key={recipe.id} className="menu-item" style={{ borderColor: recipe.color }}>
                <div className="menu-item-header">
                  <span className="menu-item-icon">{EQUIPMENT[recipe.equipment]?.icon}</span>
                  <div>
                    <h4>{recipe.name}</h4>
                    <p>{recipe.subtitle}</p>
                  </div>
                </div>
                <div className="menu-item-time">
                  {formatTime(recipe.cookTime + (recipe.restTime || 0))}
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="footer">
        <p>Recipes from Jamie Oliver's Family Roasts + Morrisons</p>
      </footer>

      {selectedRecipe && (
        <RecipeModal
          recipe={selectedRecipe}
          equipment={EQUIPMENT}
          scheduleTimes={recipeTimes[selectedRecipe.id]}
          currentTime={displayTime}
          onClose={() => setSelectedRecipeId(null)}
        />
      )}

      {activeAlert && (
        <div className={`alert-overlay ${activeAlert.isNow ? 'alert-urgent' : ''}`} onClick={dismissAlert}>
          <div className="alert-content" onClick={e => e.stopPropagation()}>
            <div className="alert-bells">🔔</div>
            <h2 className="alert-title">{activeAlert.title}</h2>
            <p className="alert-description">{activeAlert.description}</p>
            <button className="alert-dismiss" onClick={dismissAlert}>
              Got it!
            </button>
          </div>
        </div>
      )}

      {showCookingNow && (
        <div className="modal-overlay" onClick={() => setShowCookingNow(false)}>
          <div className="modal-content cooking-now-modal" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowCookingNow(false)}>&times;</button>
            <div className="modal-header cooking-now-header">
              <span className="modal-icon">🍳</span>
              <div>
                <h2>Cooking Now</h2>
                <p className="modal-subtitle">
                  {testNotificationIndex !== null ? `Simulated: ${formatClockTime(displayTime)}` : formatClockTime(displayTime)}
                </p>
              </div>
            </div>
            <div className="modal-body">
              {cookingNowItems.length === 0 ? (
                <div className="cooking-now-empty">
                  <p>Nothing is cooking right now.</p>
                  <p className="cooking-now-hint">
                    {timeUntilStart > 0
                      ? `Cooking starts in ${formatTime(timeUntilStart)}`
                      : 'Check the timeline for upcoming items'}
                  </p>
                </div>
              ) : (
                <div className="cooking-now-list">
                  {cookingNowItems.map((item, i) => (
                    <div
                      key={i}
                      className="cooking-now-item"
                      style={{ borderLeftColor: item.color }}
                      onClick={() => {
                        setShowCookingNow(false)
                        setSelectedRecipeId(item.recipe)
                      }}
                    >
                      <div className="cooking-now-item-main">
                        <span className="cooking-now-icon">{item.deviceIcon}</span>
                        <div className="cooking-now-details">
                          <span className="cooking-now-name">{item.name}</span>
                          <span className="cooking-now-device">{item.deviceName}</span>
                          {item.setting && <span className="cooking-now-setting">{item.setting}</span>}
                        </div>
                      </div>
                      <div className="cooking-now-time">
                        <span className="cooking-now-remaining">
                          {item.minutesRemaining}:{String(item.secondsRemaining).padStart(2, '0')}
                        </span>
                        <span className="cooking-now-unit">remaining</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
