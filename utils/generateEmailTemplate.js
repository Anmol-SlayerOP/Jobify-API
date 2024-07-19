// import { vercel_link } from "../configs/constants"
const {
	vercel_link
} = require('../configs/constants')
const generateEmailTemplate = ({ name, description, link, buttonLabel }) => {
	return `
  <!DOCTYPE html>
<html lang="en">
	<head>
		<meta charset="UTF-8" />
		<meta http-equiv="X-UA-Compatible" content="IE=edge" />
		<meta name="viewport" content="width=device-width, initial-scale=1.0" />
		<title>Jobify Email</title>
	</head>
	<body>
		<table width="100%" cellpadding="0" cellspacing="0" border="0">
			<tbody>
				<tr>
					<td width="100%">
						<div style="max-width: 600px;">
							<table
								align="center"
								cellpadding="0"
								cellspacing="0"
								style="
									border-spacing: 0;
									font-family: Inter, gt-eesti, ArialMT, Helvetica, Arial,
										sans-serif;
									margin: 0 auto;
									padding: 24px;
									width: 100%;
									max-width: 500px;
								"
							>
								<tbody>
									<tr>
										<td>
											<table
												style="margin-bottom: 32px; width: 100%"
												width="100%"
											>
												<tbody>
													<tr>
														<td>
															<a
																href=${vercel_link}
																style="
																	font-family: Inter, Helvetica, Arial,
																		sans-serif;
																	color: #0086bf;
																"
																target="_blank"
															>
																<img
																	src="https://i.ibb.co/FBG6gVz/Jobify-Logo.png"
																	alt="Jobify Logo"
																	style="display: block"
																	width="64"
																/>
															</a>
														</td>
													</tr>
												</tbody>
											</table>
										</td>
									</tr>
									<tr>
										<td style="word-break: break-word">
											<table
												style="margin-bottom: 20px; width: 100%"
												width="100%"
											>
												<tbody>
													<tr>
														<td>
															<table
																style="width: 100%; margin-bottom: 20px"
																width="100%"
																cellpadding="0"
																cellspacing="0"
															>
																<tbody>
																	<tr>
																		<td>
																			<strong
																				style="
																					font-family: Helvetica, Arial,
																						sans-serif;
																					color: #111827;
																				"
																				>Hi ${name},
																			</strong>

																			<h1
																				style="
																					font-size: 24px;
																					line-height: 30px;
																					color: #111827;
																					word-break: normal;
																				"
																			>
																				${description}
																			</h1>
																		</td>
																	</tr>
																</tbody>
															</table>
														</td>
													</tr>

													<tr>
														<td>
															<table
																style="
																	background-color: #fff;
																	margin-bottom: 20px;
																	table-layout: fixed;
																"
																cellspacing="0"
																cellpadding="0"
															>
																<tbody>
																	<tr>
																		<td
																			style="
																				background-color: #06b6d4;
																				color: #fff;
																				border-radius: 8px;
																				padding: 16px 24px;
																				border-color: transparent;
																				font-weight: bold;
																				font-size: 16px;
																				line-height: 1;
																			"
																		>
																			<a
																				style="
																					color: white;
																					text-decoration: none;
																				"
																				href="${link}"
																				>${buttonLabel}
																			</a>
																		</td>
																	</tr>
																</tbody>
															</table>
														</td>
													</tr>
												</tbody>
											</table>
										</td>
									</tr>
								</tbody>
							</table>
						</div>
					</td>
				</tr>
			</tbody>
		</table>
	</body>
</html>

  `
}

module.exports = generateEmailTemplate
