import { h, Component } from 'preact'
import { Menu, Content, Footer } from './index.css'


const Theme = {
	light: {
		name: 'light',
		icons: ''
	},
	dark: {
		name: 'dark',
		icons: '-light'
	}
}


export default class App extends Component {
	constructor(props) {
		super(props)

		this.state = {
			theme: {
				name: localStorage.themeName || Theme.light.name,
				icons: localStorage.themeIcons || Theme.light.icons,
			}
			// theme: localStorage.themeName || Theme.light
		}
	}

	toggleTheme() {
		let newTheme = this.state.theme == Theme.light ? Theme.dark : Theme.light
		this.setState({ theme: newTheme })
		localStorage.setItem('themeName', Theme[newTheme.name].name)
		localStorage.setItem('themeIcons', Theme[newTheme.name].icons)
	}

	render(props, { theme }) {
		return (
			<main role="application">
				<Menu tag="nav">
					<h2>juandc.co</h2>
					<ul>
						<span onClick={this.toggleTheme.bind(this)}>
							theme: {this.state.theme.name}
						</span>
					</ul>
				</Menu>
				<Content theme={theme.name}>
					<div class="above">
						<h1>Juan David Castro</h1>
						<h2>Frontend Developer at <strong><a href="https://blackome.co" target="_blank">Blackome</a></strong>
						<br/> and <strong><a href="https://softy365.com" target="_blank">Softy365</a></strong></h2>
						<div class="icons">
							<a href="https://medium.com/@fjuandc" target="_blank">
								<img src={`./icons/medium${theme.icons}.svg`} alt="medium" />
							</a>
							<a href="https://www.youtube.com/channel/UCQpaaApq0J_OT12xUxMrnkQ" target="_blank">
								<img src={`./icons/youtube${theme.icons}.svg`} alt="youtube" />
							</a>
							<a href="https://twitter.com/fjuandc" target="_blank">
								<img src={`./icons/twitter${theme.icons}.svg`} alt="twitter" />
							</a>
							<a href="https://github.com/juandc" target="_blank">
								<img src={`./icons/github${theme.icons}.svg`} alt="github" />
							</a>
						</div>
					</div>
				</Content>
				{/*<Footer>Footer</Footer>*/}
			</main>
		)
	}
}

// export default function App () {
// 	return (
// 		<main role="application">
// 			<Menu tag="nav">
// 				<h2>juandc.co</h2>
// 				<ul>
// 					<span>Light</span>
// 				</ul>
// 			</Menu>
// 			<Content>
// 				<div class="above">
// 					<h1>Juan David Castro</h1>
// 					<h2>Frontend Developer at <strong>Blackome</strong>
// 					<br/> and <strong>Softy365</strong></h2>
// 					<div class="icons">
// 						<img src="/icons/medium.svg" alt="medium" />
// 						<img src="/icons/youtube.svg" alt="twitter" />
// 						<img src="/icons/twitter.svg" alt="twitter" />
// 						<img src="/icons/github.svg" alt="twitter" />
// 					</div>
// 				</div>
// 			</Content>
// 			{/*<Footer>Footer</Footer>*/}
// 		</main>
// 	)
// }
