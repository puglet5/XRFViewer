import { MouseEvent } from "react"
import { useRef, useEffect } from "react"
import Draggable from "react-draggable"
import { memo } from "react"

interface Props {
  visible: boolean
  updateSelectedElements: React.Dispatch<React.SetStateAction<number[]>>
  selectedElements: number[]
}

const selectedElementClasses = [
  "font-bold",
  "!bg-opacity-100",
  "z-100",
  "sticky"
]

function PeriodicTable({
  visible,
  updateSelectedElements,
  selectedElements
}: Props) {
  const tableRef = useRef(null)
  const nodeRef = useRef(null)

  function handleClick(e: MouseEvent) {
    const elementId: string = (e.target as HTMLElement).id
    if (tableRef.current) {
      const elementCell = Array.from(
        (tableRef.current as HTMLTableElement).getElementsByTagName("td")
      ).filter((e) => e.id === elementId)[0]
      if (elementId) {
        const elementNumber = +elementId
        if (selectedElements.includes(elementNumber)) {
          const newSelectedElements = selectedElements.filter(
            (e) => e !== elementNumber
          )
          if (!newSelectedElements.length)
            localStorage.setItem("selectedElements", "[]")
          updateSelectedElements(newSelectedElements.sort((a, b) => a - b))
          elementCell.classList.remove(...selectedElementClasses)
        } else {
          updateSelectedElements(
            [...selectedElements, elementNumber].sort((a, b) => a - b)
          )
        }
      }
    } else {
      return
    }
  }

  useEffect(() => {
    if (tableRef.current) {
      const selectedElementCells = Array.from(
        (tableRef.current as HTMLTableElement).getElementsByTagName("td")
      ).filter((e) => selectedElements.includes(+e.id))

      selectedElementCells.map((e) =>
        e.classList.add(...selectedElementClasses)
      )

      if (selectedElements.length === 0) {
        Array.from(
          (tableRef.current as HTMLTableElement).getElementsByTagName("td")
        ).map((e) => e.classList.remove(...selectedElementClasses))
      }
    }
  }, [selectedElements])

  return (
    <div className="absolute z-40 m-4">
      <Draggable nodeRef={nodeRef} bounds={"html"} handle=".handle">
        <div
          className={`${
            visible ? "block" : "hidden"
          } w-full border border-ptx  bg-pbg`}
          ref={nodeRef}
        >
          <div className="handle h-8 w-full cursor-move border-b border-ptx"></div>
          <div className="w-full p-2">
            <table
              ref={tableRef}
              id="periodic"
              className="cursor-pointer select-none"
              onClick={handleClick}
            >
              <tbody>
                <tr>
                  <td id="1" className="bg-sky-300">
                    H
                  </td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td id="2" className="bg-fuchsia-300">
                    He
                  </td>
                </tr>
                <tr>
                  <td id="3" className="bg-cyan-300">
                    Li
                  </td>
                  <td id="4" className="bg-rose-300">
                    Be
                  </td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td id="5" className="bg-red-400">
                    B
                  </td>
                  <td id="6" className="bg-lime-300">
                    C
                  </td>
                  <td id="7" className="bg-lime-300">
                    N
                  </td>
                  <td id="8" className="bg-lime-300">
                    O
                  </td>
                  <td id="9" className="bg-lime-300">
                    F
                  </td>
                  <td id="10" className="bg-fuchsia-300">
                    Ne
                  </td>
                </tr>
                <tr>
                  <td id="11" className="bg-cyan-300">
                    Na
                  </td>
                  <td id="12" className="bg-rose-300">
                    Mg
                  </td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td id="13" className="bg-sky-300">
                    Al
                  </td>
                  <td id="14" className="bg-red-400">
                    Si
                  </td>
                  <td id="15" className="bg-lime-300">
                    P
                  </td>
                  <td id="16" className="bg-lime-300">
                    S
                  </td>
                  <td id="17" className="bg-lime-300">
                    Cl
                  </td>
                  <td id="18" className="bg-fuchsia-300">
                    Ar
                  </td>
                </tr>
                <tr>
                  <td id="19" className="bg-cyan-300">
                    K
                  </td>
                  <td id="20" className="bg-rose-300">
                    Ca
                  </td>
                  <td id="21" className="bg-purple-300">
                    Sc
                  </td>
                  <td></td>
                  <td id="22" className="bg-purple-300">
                    Ti
                  </td>
                  <td id="23" className="bg-purple-300">
                    V
                  </td>
                  <td id="24" className="bg-purple-300">
                    Cr
                  </td>
                  <td id="25" className="bg-purple-300">
                    Mn
                  </td>
                  <td id="26" className="bg-purple-300">
                    Fe
                  </td>
                  <td id="27" className="bg-purple-300">
                    Co
                  </td>
                  <td id="28" className="bg-purple-300">
                    Ni
                  </td>
                  <td id="29" className="bg-purple-300">
                    Cu
                  </td>
                  <td id="30" className="bg-purple-300">
                    Zn
                  </td>
                  <td id="31" className="bg-sky-300">
                    Ga
                  </td>
                  <td id="32" className="bg-red-400">
                    Ge
                  </td>
                  <td id="33" className="bg-red-400">
                    As
                  </td>
                  <td id="34" className="bg-lime-300">
                    Se
                  </td>
                  <td id="35" className="bg-lime-300">
                    Br
                  </td>
                  <td id="36" className="bg-fuchsia-300">
                    Kr
                  </td>
                </tr>
                <tr>
                  <td id="37" className="bg-cyan-300">
                    Rb
                  </td>
                  <td id="38" className="bg-rose-300">
                    Sr
                  </td>
                  <td id="39" className="bg-purple-300">
                    Y
                  </td>
                  <td></td>

                  <td id="40" className="bg-purple-300">
                    Zr
                  </td>
                  <td id="41" className="bg-purple-300">
                    Nb
                  </td>
                  <td id="42" className="bg-purple-300">
                    Mo
                  </td>
                  <td id="43" className="bg-purple-300">
                    Tc
                  </td>
                  <td id="44" className="bg-purple-300">
                    Ru
                  </td>
                  <td id="45" className="bg-purple-300">
                    Th
                  </td>
                  <td id="46" className="bg-purple-300">
                    Pd
                  </td>
                  <td id="47" className="bg-purple-300">
                    Ag
                  </td>
                  <td id="48" className="bg-purple-300">
                    Cd
                  </td>
                  <td id="49" className="bg-sky-300">
                    In
                  </td>
                  <td id="50" className="bg-sky-300">
                    Sn
                  </td>
                  <td id="51" className="bg-red-400">
                    Sb
                  </td>
                  <td id="52" className="bg-red-400">
                    Te
                  </td>
                  <td id="53" className="bg-lime-300">
                    I
                  </td>
                  <td id="54" className="bg-fuchsia-300">
                    Xe
                  </td>
                </tr>
                <tr>
                  <td id="55" className="bg-cyan-300">
                    Cs
                  </td>
                  <td id="56" className="bg-rose-300">
                    Ba
                  </td>
                  <td id="57" className="bg-indigo-400">
                    La
                  </td>
                  <td></td>

                  <td id="72" className="bg-purple-300">
                    Hf
                  </td>
                  <td id="73" className="bg-purple-300">
                    Ta
                  </td>
                  <td id="74" className="bg-purple-300">
                    W
                  </td>
                  <td id="75" className="bg-purple-300">
                    Re
                  </td>
                  <td id="76" className="bg-purple-300">
                    Os
                  </td>
                  <td id="77" className="bg-purple-300">
                    Ir
                  </td>
                  <td id="78" className="bg-purple-300">
                    Pt
                  </td>
                  <td id="79" className="bg-purple-300">
                    Au
                  </td>
                  <td id="80" className="bg-purple-300">
                    Hg
                  </td>
                  <td id="81" className="bg-sky-300">
                    Tl
                  </td>
                  <td id="82" className="bg-sky-300">
                    Pb
                  </td>
                  <td id="83" className="bg-sky-300">
                    Bi
                  </td>
                  <td id="84" className="bg-sky-300">
                    Po
                  </td>
                  <td id="85" className="bg-sky-300">
                    At
                  </td>
                  <td id="86" className="bg-fuchsia-300">
                    Rn
                  </td>
                </tr>
                <tr>
                  <td id="87" className="bg-cyan-300">
                    Fr
                  </td>
                  <td id="88" className="bg-rose-300">
                    Ra
                  </td>
                  <td id="89" className="bg-yellow-700">
                    Ac
                  </td>
                  <td></td>

                  <td id="104" className="bg-purple-300">
                    Rf
                  </td>
                  <td id="105" className="bg-purple-300">
                    Db
                  </td>
                  <td id="106" className="bg-purple-300">
                    Sg
                  </td>
                  <td id="107" className="bg-purple-300">
                    Bh
                  </td>
                  <td id="108" className="bg-purple-300">
                    Hs
                  </td>
                  <td id="109" className="bg-gray-300">
                    Mt
                  </td>
                  <td id="110" className="bg-gray-300">
                    Ds
                  </td>
                  <td id="111" className="bg-gray-300">
                    Rg
                  </td>
                  <td id="112" className="bg-gray-300">
                    Cn
                  </td>
                  <td id="113" className="bg-gray-300">
                    Nh
                  </td>
                  <td id="114" className="bg-gray-300">
                    Fl
                  </td>
                  <td id="115" className="bg-gray-300">
                    Mc
                  </td>
                  <td id="116" className="bg-gray-300">
                    Lv
                  </td>
                  <td id="117" className="bg-gray-300">
                    Ts
                  </td>
                  <td id="118" className="bg-gray-300">
                    Og
                  </td>
                </tr>
                <tr>
                  <td className="p-0.5"></td>
                </tr>
                <tr className="">
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td id="58" className="bg-indigo-400">
                    Ce
                  </td>
                  <td id="59" className="bg-indigo-400">
                    Pr
                  </td>
                  <td id="60" className="bg-indigo-400">
                    Nd
                  </td>
                  <td id="61" className="bg-indigo-400">
                    Pm
                  </td>
                  <td id="62" className="bg-indigo-400">
                    Sm
                  </td>
                  <td id="63" className="bg-indigo-400">
                    Eu
                  </td>
                  <td id="64" className="bg-indigo-400">
                    Gd
                  </td>
                  <td id="65" className="bg-indigo-400">
                    Tb
                  </td>
                  <td id="66" className="bg-indigo-400">
                    Dy
                  </td>
                  <td id="67" className="bg-indigo-400">
                    Ho
                  </td>
                  <td id="68" className="bg-indigo-400">
                    Er
                  </td>
                  <td id="69" className="bg-indigo-400">
                    Tm
                  </td>
                  <td id="70" className="bg-indigo-400">
                    Yb
                  </td>
                  <td id="71" className="bg-indigo-400">
                    Lu
                  </td>
                  <td></td>
                </tr>
                <tr>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td id="90" className="bg-yellow-700">
                    Th
                  </td>
                  <td id="91" className="bg-yellow-700">
                    Pa
                  </td>
                  <td id="92" className="bg-yellow-700">
                    U
                  </td>
                  <td id="93" className="bg-yellow-700">
                    Np
                  </td>
                  <td id="94" className="bg-yellow-700">
                    Pu
                  </td>
                  <td id="95" className="bg-yellow-700">
                    Am
                  </td>
                  <td id="96" className="bg-yellow-700">
                    Cm
                  </td>
                  <td id="97" className="bg-yellow-700">
                    Bk
                  </td>
                  <td id="98" className="bg-yellow-700">
                    Cf
                  </td>
                  <td id="99" className="bg-yellow-700">
                    Es
                  </td>
                  <td id="100" className="bg-yellow-700">
                    Fm
                  </td>
                  <td id="101" className="bg-yellow-700">
                    Md
                  </td>
                  <td id="102" className="bg-yellow-700">
                    No
                  </td>
                  <td id="103" className="bg-yellow-700">
                    Lr
                  </td>
                  <td></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </Draggable>
    </div>
  )
}

export default memo(PeriodicTable)
