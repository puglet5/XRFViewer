import { MouseEvent } from "react"
import { useRef, useEffect } from "react";

interface Props {
  visible: boolean
  updateSelectedElements: React.Dispatch<React.SetStateAction<number[]>>,
  selectedElements: number[]
}

export default function PeriodicTable({ visible, updateSelectedElements, selectedElements }: Props) {
  const tableRef = useRef(null)
  const handleClick = (e: MouseEvent) => {
    const elementId: string = (e.target as HTMLElement).id
    if (tableRef.current) {
      const elementCell = Array.from((tableRef.current as HTMLTableElement).getElementsByTagName("td")).filter(e => e.id === elementId)[0]
      if (elementId) {
        const elementNumber = Number(elementId)
        if (selectedElements.includes(elementNumber)) {
          const newSelectedElements = selectedElements.filter(e => e !== elementNumber)
          if (!newSelectedElements.length) localStorage.setItem("selectedElements", "[]")
          updateSelectedElements(newSelectedElements)
          elementCell.classList.remove("!outline", "!outline-2")
        } else {
          updateSelectedElements([...selectedElements, elementNumber])
        }
      }
    } else { return }
  }

  useEffect(() => {
    if (tableRef.current) {
      const elementCells = Array.from((tableRef.current as HTMLTableElement).getElementsByTagName("td")).filter(e => selectedElements.includes(Number(e.id)))

      elementCells.map(e => e.classList.add("!outline", "!outline-2")
      )
    }

  }, [selectedElements])


  return (
    <div className={`${visible ? "block" : "hidden"} w-full`} >
      <table ref={tableRef} id="periodic" className="w-96 cursor-pointer select-none" onClick={handleClick}>
        <tbody>
          <tr>
            <td id="1" className="bg-sky-300"><sup>1</sup>H</td>
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
            <td id="2" className="bg-fuchsia-300"><sup>2</sup>He</td>
          </tr>
          <tr>
            <td id="3" className="bg-cyan-300"><sup>3</sup>Li</td>
            <td id="4" className="bg-rose-300"><sup>4</sup>Be</td>
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
            <td id="5" className="bg-red-400"><sup>5</sup>B</td>
            <td id="6" className="bg-lime-300"><sup>6</sup>C</td>
            <td id="7" className="bg-lime-300"><sup>7</sup>N</td>
            <td id="8" className="bg-lime-300"><sup>8</sup>O</td>
            <td id="9" className="bg-lime-300"><sup>9</sup>F</td>
            <td id="10" className="bg-fuchsia-300"><sup>10</sup>Ne</td>
          </tr>
          <tr>
            <td id="11" className="bg-cyan-300"><sup>11</sup>Na</td>
            <td id="12" className="bg-rose-300"><sup>12</sup>Mg</td>
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
            <td id="13" className="bg-sky-300"><sup>13</sup>Al</td>
            <td id="14" className="bg-red-400"><sup>14</sup>Si</td>
            <td id="15" className="bg-lime-300"><sup>15</sup>P</td>
            <td id="16" className="bg-lime-300"><sup>16</sup>S</td>
            <td id="17" className="bg-lime-300"><sup>17</sup>Cl</td>
            <td id="18" className="bg-fuchsia-300"><sup>18</sup>Ar</td>
          </tr>
          <tr>
            <td id="19" className="bg-cyan-300"><sup>19</sup>K</td>
            <td id="20" className="bg-rose-300"><sup>20</sup>Ca</td>
            <td id="21" className="bg-purple-300"><sup>21</sup>Sc</td>
            <td></td>
            <td id="22" className="bg-purple-300"><sup>22</sup>Ti</td>
            <td id="23" className="bg-purple-300"><sup>23</sup>V</td>
            <td id="24" className="bg-purple-300"><sup>24</sup>Cr</td>
            <td id="25" className="bg-purple-300"><sup>25</sup>Mn</td>
            <td id="26" className="bg-purple-300"><sup>26</sup>Fe</td>
            <td id="27" className="bg-purple-300"><sup>27</sup>Co</td>
            <td id="28" className="bg-purple-300"><sup>28</sup>Ni</td>
            <td id="29" className="bg-purple-300"><sup>29</sup>Cu</td>
            <td id="30" className="bg-purple-300"><sup>30</sup>Zn</td>
            <td id="31" className="bg-sky-300"><sup>31</sup>Ga</td>
            <td id="32" className="bg-red-400"><sup>32</sup>Ge</td>
            <td id="33" className="bg-red-400"><sup>33</sup>As</td>
            <td id="34" className="bg-lime-300"><sup>34</sup>Se</td>
            <td id="35" className="bg-lime-300"><sup>35</sup>Br</td>
            <td id="36" className="bg-fuchsia-300"><sup>36</sup>Kr</td>
          </tr>
          <tr>
            <td id="37" className="bg-cyan-300"><sup>37</sup>Rb</td>
            <td id="38" className="bg-rose-300"><sup>38</sup>Sr</td>
            <td id="39" className="bg-purple-300"><sup>39</sup>Y</td>
            <td></td>

            <td id="40" className="bg-purple-300"><sup>40</sup>Zr</td>
            <td id="41" className="bg-purple-300"><sup>41</sup>Nb</td>
            <td id="42" className="bg-purple-300"><sup>42</sup>Mo</td>
            <td id="43" className="bg-purple-300"><sup>43</sup>Tc</td>
            <td id="44" className="bg-purple-300"><sup>44</sup>Ru</td>
            <td id="45" className="bg-purple-300"><sup>45</sup>Th</td>
            <td id="46" className="bg-purple-300"><sup>46</sup>Pd</td>
            <td id="47" className="bg-purple-300"><sup>47</sup>Ag</td>
            <td id="48" className="bg-purple-300"><sup>48</sup>Cd</td>
            <td id="49" className="bg-sky-300"><sup>49</sup>In</td>
            <td id="50" className="bg-sky-300"><sup>50</sup>Sn</td>
            <td id="51" className="bg-red-400"><sup>51</sup>Sb</td>
            <td id="52" className="bg-red-400"><sup>52</sup>Te</td>
            <td id="53" className="bg-lime-300"><sup>53</sup>I</td>
            <td id="54" className="bg-fuchsia-300"><sup>54</sup>Xe</td>
          </tr>
          <tr>
            <td id="55" className="bg-cyan-300"><sup>55</sup>Cs</td>
            <td id="56" className="bg-rose-300"><sup>56</sup>Ba</td>
            <td id="57" className="bg-indigo-400"><sup>57</sup>La</td>
            <td></td>

            <td id="72" className="bg-purple-300"><sup>72</sup>Hf</td>
            <td id="73" className="bg-purple-300"><sup>73</sup>Ta</td>
            <td id="74" className="bg-purple-300"><sup>74</sup>W</td>
            <td id="75" className="bg-purple-300"><sup>75</sup>Re</td>
            <td id="76" className="bg-purple-300"><sup>76</sup>Os</td>
            <td id="77" className="bg-purple-300"><sup>77</sup>Ir</td>
            <td id="78" className="bg-purple-300"><sup>78</sup>Pt</td>
            <td id="79" className="bg-purple-300"><sup>79</sup>Au</td>
            <td id="80" className="bg-purple-300"><sup>80</sup>Hg</td>
            <td id="81" className="bg-sky-300"><sup>81</sup>Tl</td>
            <td id="82" className="bg-sky-300"><sup>82</sup>Pb</td>
            <td id="83" className="bg-sky-300"><sup>83</sup>Bi</td>
            <td id="84" className="bg-sky-300"><sup>84</sup>Po</td>
            <td id="85" className="bg-sky-300"><sup>85</sup>At</td>
            <td id="86" className="bg-fuchsia-300"><sup>86</sup>Rn</td>
          </tr>
          <tr>
            <td id="87" className="bg-cyan-300"><sup>87</sup>Fr</td>
            <td id="88" className="bg-rose-300"><sup>88</sup>Ra</td>
            <td id="89" className="bg-yellow-700"><sup>89</sup>Ac</td>
            <td></td>

            <td id="104" className="bg-purple-300"><sup>104</sup>Rf</td>
            <td id="105" className="bg-purple-300"><sup>105</sup>Db</td>
            <td id="106" className="bg-purple-300"><sup>106</sup>Sg</td>
            <td id="107" className="bg-purple-300"><sup>107</sup>Bh</td>
            <td id="108" className="bg-purple-300"><sup>108</sup>Hs</td>
            <td id="109" className="bg-gray-300"><sup>109</sup>Mt</td>
            <td id="110" className="bg-gray-300"><sup>110</sup>Ds</td>
            <td id="111" className="bg-gray-300"><sup>111</sup>Rg</td>
            <td id="112" className="bg-gray-300"><sup>112</sup>Cn</td>
            <td id="113" className="bg-gray-300"><sup>113</sup>Nh</td>
            <td id="114" className="bg-gray-300"><sup>114</sup>Fl</td>
            <td id="115" className="bg-gray-300"><sup>115</sup>Mc</td>
            <td id="116" className="bg-gray-300"><sup>116</sup>Lv</td>
            <td id="117" className="bg-gray-300"><sup>117</sup>Ts</td>
            <td id="118" className="bg-gray-300"><sup>118</sup>Og</td>
          </tr>
          <tr>
            <td className="p-0.5"></td>
          </tr>
          <tr className="">
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td id="58" className="bg-indigo-400"><sup>58</sup>Ce</td>
            <td id="59" className="bg-indigo-400"><sup>59</sup>Pr</td>
            <td id="60" className="bg-indigo-400"><sup>60</sup>Nd</td>
            <td id="61" className="bg-indigo-400"><sup>61</sup>Pm</td>
            <td id="62" className="bg-indigo-400"><sup>62</sup>Sm</td>
            <td id="63" className="bg-indigo-400"><sup>63</sup>Eu</td>
            <td id="64" className="bg-indigo-400"><sup>64</sup>Gd</td>
            <td id="65" className="bg-indigo-400"><sup>65</sup>Tb</td>
            <td id="66" className="bg-indigo-400"><sup>66</sup>Dy</td>
            <td id="67" className="bg-indigo-400"><sup>67</sup>Ho</td>
            <td id="68" className="bg-indigo-400"><sup>68</sup>Er</td>
            <td id="69" className="bg-indigo-400"><sup>69</sup>Tm</td>
            <td id="70" className="bg-indigo-400"><sup>70</sup>Yb</td>
            <td id="71" className="bg-indigo-400"><sup>71</sup>Lu</td>
            <td></td>
          </tr>
          <tr>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td id="90" className="bg-yellow-700"><sup>90</sup>Th</td>
            <td id="91" className="bg-yellow-700"><sup>91</sup>Pa</td>
            <td id="92" className="bg-yellow-700"><sup>92</sup>U</td>
            <td id="93" className="bg-yellow-700"><sup>93</sup>Np</td>
            <td id="94" className="bg-yellow-700"><sup>94</sup>Pu</td>
            <td id="95" className="bg-yellow-700"><sup>95</sup>Am</td>
            <td id="96" className="bg-yellow-700"><sup>96</sup>Cm</td>
            <td id="97" className="bg-yellow-700"><sup>97</sup>Bk</td>
            <td id="98" className="bg-yellow-700"><sup>98</sup>Cf</td>
            <td id="99" className="bg-yellow-700"><sup>99</sup>Es</td>
            <td id="100" className="bg-yellow-700"><sup>100</sup>Fm</td>
            <td id="101" className="bg-yellow-700"><sup>101</sup>Md</td>
            <td id="102" className="bg-yellow-700"><sup>102</sup>No</td>
            <td id="103" className="bg-yellow-700"><sup>103</sup>Lr</td>
            <td></td>
          </tr>
        </tbody>
      </table>
    </div >
  )
}

